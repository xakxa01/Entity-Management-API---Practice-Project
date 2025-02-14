import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = './db/database.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
      entity_id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      last_reported TEXT NOT NULL,
      last_changed TEXT NOT NULL
  )
`);
