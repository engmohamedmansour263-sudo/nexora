import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

// Local development adapter. Never expose this module to Client Components.
// Production will use the Supabase/PostgreSQL adapter instead.
const databasePath = path.resolve(process.cwd(), process.env.NEXORA_DATABASE_PATH ?? 'database/nexora-dev.sqlite');

let database: DatabaseSync | undefined;

export function getLocalDatabase(): DatabaseSync {
  if (process.env.NEXORA_DATABASE_MODE === 'supabase') {
    throw new Error('The local SQLite adapter is disabled in Supabase mode.');
  }
  database ??= new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON;');
  return database;
}
