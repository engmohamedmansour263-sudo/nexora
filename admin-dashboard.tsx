'use client';

import { useMemo, useState } from 'react';
import { Activity, Calculator, FileText, LayoutDashboard, Package, Plus, Search, ShieldCheck, Users, Upload } from 'lucide-react';
import { templates } from '@/lib/templates';

type Item = { id: number; title: string; kind: 'Calculator' | 'Template'; category: string; status: 'Published' | 'Draft' };
const seed: Item[] = [
  { id: 1, title: 'Percentage Calculator', kind: 'Calculator', category: 'Mathematics', status: 'Published' },
  { id: 2, title: 'BMI Calculator', kind: 'Calculator', category: 'Health & Fitness', status: 'Published' },
  { id: 3, title: 'Monthly Budget', kind: 'Template', category: 'Business & Finance', status: 'Published' },
  { id: 4, title: 'Project Planner', kind: 'Template', category: 'Productivity', status: 'Draft' },
];

export default function AdminDashboard() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState<'overview' | 'catalog' | 'users' | 'orders'>('overview');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<'Calculator' | 'Template'>('Calculator');
  const [category, setCategory] = useState('Mathematics');
  const [assetSlug, setAssetSlug] = useState(templates[0]?.slug ?? 'monthly-budget');
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const filtered = useMemo(() => items.filter(x => `${x.title} ${x.category} ${x.kind}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const nav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: Calculator },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders & plans', icon: Package },
  ] as const;
  async function uploadAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!assetFile || !adminToken) { setUploadMessage('Choose a file and enter the local admin token.'); return; }
    setUploading(true); setUploadMessage('Uploading...');
    const form = new FormData(); form.set('slug', assetSlug); form.set('file', assetFile);
    try {
      const response = await fetch('/api/admin/templates/upload', { method: 'POST', headers: { 'x-nexora-admin-token': adminToken }, body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed.');
      setUploadMessage(`Uploaded ${result.fileName} (${Math.ceil(result.size / 1024)} KB).`); setAssetFile(null);
    } catch (error) { setUploadMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setUploading(false); }
  }
  function addItem(e: React.FormEvent) {
    e.preventDefault(); if (!title.trim()) return;
    setItems(old => [{ id: Date.now(), title: title.trim(), kind, category, status: 'Draft' }, ...old]);
    setTitle(''); setShowForm(false); setTab('catalog');
  }
  return <div className="mx-auto max-w-7xl px-5 py-8">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div><a href="/en" className="text-sm font-black tracking-[.22em]">NEXORA</a><p className="mt-1 text-xs text-zinc-500">Workspace / Administration</p></div>
      <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-200"><ShieldCheck size={14}/> Admin workspace preview</div>
    </header>
    <div className="grid gap-7 py-7 md:grid-cols-[220px_1fr]">
      <aside className="space-y-2">
        {nav.map(n => <button key={n.id} onClick={() => setTab(n.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${tab === n.id ? 'bg-violet-500 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}><n.icon size={17}/>{n.label}</button>)}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.03] p-4"><Activity size={18} className="text-violet-300"/><p className="mt-3 text-sm font-semibold">Development mode</p><p className="mt-1 text-xs leading-5 text-zinc-500">Changes in this preview are held in browser state. Persistent admin actions will be connected after database policies and admin roles are configured.</p></div>
      </aside>
      <main className="min-w-0">
        {tab === 'overview' && <><div className="mb-6"><p className="text-sm text-violet-300">Workspace overview</p><h1 className="mt-1 text-3xl font-semibold">Good work starts here.</h1><p className="mt-2 text-sm text-zinc-400">Manage Nexora's catalog and prepare the platform for launch.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{label:'Catalog items',value:items.length,icon:Calculator},{label:'Published',value:items.filter(x=>x.status==='Published').length,icon:FileText},{label:'Registered users',value:'—',icon:Users},{label:'Orders',value:'—',icon:Package}].map(x=><div key={x.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><x.icon className="text-violet-300" size={19}/><p className="mt-5 text-2xl font-semibold">{x.value}</p><p className="mt-1 text-xs text-zinc-500">{x.label}</p></div>)}</div><div className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-5"><h2 className="font-semibold">Quick actions</h2><div className="mt-4 flex flex-wrap gap-3"><button onClick={()=>{setTab('catalog');setShowForm(true)}} className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold"><Plus size={15} className="mr-2 inline"/>Add catalog item</button><button onClick={()=>setTab('users')} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm">Review user area</button></div></div></>}
        {tab === 'catalog' && <><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-violet-300">Content management</p><h1 className="mt-1 text-3xl font-semibold">Catalog</h1><p className="mt-2 text-sm text-zinc-400">Manage calculators and downloadable templates.</p></div><button onClick={()=>setShowForm(v=>!v)} className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold"><Plus size={16} className="mr-2 inline"/>New item</button></div>
          {showForm && <form onSubmit={addItem} className="mt-5 grid gap-3 rounded-2xl border border-violet-400/20 bg-violet-400/[.05] p-5 sm:grid-cols-2"><label className="text-xs text-zinc-400">Title<input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g. Date difference calculator" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none focus:border-violet-400"/></label><label className="text-xs text-zinc-400">Type<select value={kind} onChange={e=>setKind(e.target.value as typeof kind)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#181a23] px-3 py-3 text-sm text-white"><option>Calculator</option><option>Template</option></select></label><label className="text-xs text-zinc-400">Category<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#181a23] px-3 py-3 text-sm text-white">{['Mathematics','Health & Fitness','Business & Finance','Technology','Time & Date','Travel','Home & Construction','Education','Productivity'].map(c=><option key={c}>{c}</option>)}</select></label><div className="flex items-end gap-2"><button className="rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold">Save draft</button><button type="button" onClick={()=>setShowForm(false)} className="rounded-xl border border-white/10 px-4 py-3 text-sm">Cancel</button></div></form>}
          {process.env.NODE_ENV !== 'production' && <form onSubmit={uploadAsset} className="mt-5 rounded-2xl border border-white/10 bg-white/[.025] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><Upload size={16} className="text-violet-300"/>Private template asset upload <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] text-amber-200">Local only</span></div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">Upload a CSV, XLSX or PDF file to the private local storage folder. Premium files remain protected by entitlement checks.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <select value={assetSlug} onChange={e=>setAssetSlug(e.target.value)} className="rounded-xl border border-white/10 bg-[#181a23] px-3 py-3 text-sm text-white">{templates.map(item=><option key={item.slug} value={item.slug}>{item.names.en}</option>)}</select>
              <input type="file" accept=".csv,.xlsx,.pdf" onChange={e=>setAssetFile(e.target.files?.[0] ?? null)} className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500 file:px-3 file:py-2 file:text-xs file:text-white"/>
              <input type="password" value={adminToken} onChange={e=>setAdminToken(e.target.value)} placeholder="Local admin token" autoComplete="off" className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none"/>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3"><button disabled={uploading} className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-50">{uploading ? 'Uploading…' : 'Upload private file'}</button>{uploadMessage && <p role="status" className="text-xs text-zinc-400">{uploadMessage}</p>}</div>
          </form>}
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3"><Search size={16} className="text-zinc-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search catalog..." className="w-full bg-transparent py-3 text-sm outline-none"/></div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10"><div className="grid grid-cols-[1fr_110px_140px] gap-3 bg-white/[.04] px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500"><span>Item</span><span>Type</span><span>Status</span></div>{filtered.map(item=><div key={item.id} className="grid grid-cols-[1fr_110px_140px] items-center gap-3 border-t border-white/5 px-4 py-4 text-sm"><div><p className="font-medium">{item.title}</p><p className="mt-1 text-xs text-zinc-500">{item.category}</p></div><span className="text-xs text-zinc-400">{item.kind}</span><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] ${item.status==='Published'?'bg-emerald-400/10 text-emerald-300':'bg-amber-400/10 text-amber-200'}`}>{item.status}</span></div>)}{filtered.length===0&&<p className="p-6 text-sm text-zinc-500">No matching items.</p>}</div></>}
        {tab === 'users' && <Panel title="Users" subtitle="Account management" detail="The registration and sign-in experience will use Supabase Auth. User lists, role changes, and account moderation remain disabled until administrator permissions and row-level security policies are installed." icon={<Users/>}/>}
        {tab === 'orders' && <Panel title="Orders & plans" subtitle="Commerce management" detail="The order and subscription schema is planned. No payments are being accepted in this development build. Payment-provider webhooks and verified entitlements must be implemented before launch." icon={<Package/>}/>}
      </main>
    </div>
  </div>;
}
function Panel({title,subtitle,detail,icon}:{title:string;subtitle:string;detail:string;icon:React.ReactNode}) { return <div><div className="text-violet-300">{icon}</div><p className="mt-4 text-sm text-violet-300">{subtitle}</p><h1 className="mt-1 text-3xl font-semibold">{title}</h1><div className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-sm leading-7 text-zinc-400">{detail}</p></div></div>; }
