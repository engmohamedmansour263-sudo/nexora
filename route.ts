import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getLocalDatabase } from '@/lib/db';
import { getTemplate } from '@/lib/templates';

export const runtime = 'nodejs';

const allowedTypes: Record<string, string> = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

export async function POST(request: Request) {
  // This upload helper is intentionally development-only. Production uploads
  // must move to private Supabase Storage with an authenticated admin policy.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Local uploads are disabled in production.' }, { status: 404 });
  }
  const expectedToken = process.env.NEXORA_LOCAL_ADMIN_TOKEN;
  const suppliedToken = request.headers.get('x-nexora-admin-token');
  if (!expectedToken || suppliedToken !== expectedToken) {
    return NextResponse.json({ error: 'A valid local admin token is required.' }, { status: 401 });
  }

  const form = await request.formData();
  const slug = String(form.get('slug') ?? '');
  const file = form.get('file');
  if (!getTemplate(slug) || !(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a known template and a file.' }, { status: 400 });
  }
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  const mimeType = allowedTypes[extension];
  if (!mimeType || file.size === 0 || file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: 'Allowed formats: CSV, XLSX, PDF. Maximum size: 15 MB.' }, { status: 400 });
  }

  const db = getLocalDatabase();
  const row = db.prepare(`
    SELECT tf.id, tf.template_id, tf.is_paid_asset
    FROM template_files tf
    JOIN template_translations tt ON tt.template_id = tf.template_id
    WHERE tt.locale = 'en' AND tt.slug = ?
    ORDER BY tf.version DESC LIMIT 1
  `).get(slug) as { id: string; template_id: string; is_paid_asset: number } | undefined;
  if (!row) return NextResponse.json({ error: 'Template record is missing from the local catalog.' }, { status: 404 });

  const directory = path.resolve(process.cwd(), 'storage', 'templates');
  await mkdir(directory, { recursive: true });
  const fileName = `${slug}.${extension}`;
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()), { flag: 'w' });
  db.prepare(`UPDATE template_files SET storage_path = ?, file_name = ?, mime_type = ?, version = version + 1 WHERE id = ?`)
    .run(`templates/${fileName}`, fileName, mimeType, row.id);

  return NextResponse.json({ ok: true, slug, fileName, size: file.size, paidAsset: Boolean(row.is_paid_asset) });
}
