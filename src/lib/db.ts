import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { db?: Database.Database };

export const db = globalForDb.db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export type User = { id: number; username: string; created_at: string };

export function findUserByUsername(username: string) {
  return db
    .prepare("SELECT id, username, password_hash, created_at FROM users WHERE username = ?")
    .get(username) as (User & { password_hash: string }) | undefined;
}

export function findUserById(id: number) {
  return db.prepare("SELECT id, username, created_at FROM users WHERE id = ?").get(id) as
    | User
    | undefined;
}

export function createUser(username: string, passwordHash: string) {
  const result = db
    .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .run(username, passwordHash);
  return Number(result.lastInsertRowid);
}
