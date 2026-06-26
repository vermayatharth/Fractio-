import { mkdirSync } from "fs";
import { createHash } from "crypto";
import path from "path";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "..", "db", "fractio.sqlite");
let cachedDb: Database.Database | null = null;

interface UserRecord {
  id: number;
  email: string;
  full_name: string;
  kyc_tier: string;
  created_at: string;
}

function ensureDbFile() {
  mkdirSync(path.dirname(dbPath), { recursive: true });
}

export function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  ensureDbFile();
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      kyc_tier TEXT NOT NULL DEFAULT 'tier_0',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  cachedDb = db;
  return db;
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function createUser(input: {
  email: string;
  fullName: string;
  password: string;
}) {
  const db = getDb();
  const insert = db.prepare(
    "INSERT INTO users (email, full_name, password_hash) VALUES (?, ?, ?)"
  );
  const result = insert.run(input.email.toLowerCase(), input.fullName.trim(), hashPassword(input.password));

  return db
    .prepare(
      "SELECT id, email, full_name AS fullName, kyc_tier AS kycTier, created_at AS createdAt FROM users WHERE id = ?"
    )
    .get(result.lastInsertRowid) as UserRecord & { fullName: string; kycTier: string; createdAt: string };
}

export function verifyUser(input: { email: string; password: string }) {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, email, full_name AS fullName, password_hash AS passwordHash, kyc_tier AS kycTier, created_at AS createdAt FROM users WHERE email = ?"
    )
    .get(input.email.toLowerCase()) as
    | (UserRecord & { fullName: string; passwordHash: string; kycTier: string; createdAt: string })
    | undefined;

  if (!row) {
    return null;
  }

  if (row.passwordHash !== hashPassword(input.password)) {
    return null;
  }

  const { passwordHash, ...safeUser } = row;
  return safeUser;
}

export function getUserById(id: string | number) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id, email, full_name AS fullName, kyc_tier AS kycTier, created_at AS createdAt FROM users WHERE id = ?"
    )
    .get(Number(id)) as
    | (UserRecord & { fullName: string; kycTier: string; createdAt: string })
    | undefined;
}
