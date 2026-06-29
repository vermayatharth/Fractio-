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

export interface InvestmentRecord {
  id: number;
  user_id: number;
  asset_name: string;
  city: string;
  invested_amount: number;
  current_value: number;
  returns_pct: number;
  units_held: number;
  invested_at: string;
  updated_at: string;
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      asset_name TEXT NOT NULL,
      city TEXT NOT NULL,
      invested_amount REAL NOT NULL,
      current_value REAL NOT NULL,
      returns_pct REAL NOT NULL DEFAULT 0,
      units_held INTEGER NOT NULL DEFAULT 1,
      invested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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

// ---------------------------------------------------------------------------
// Investment CRUD
// ---------------------------------------------------------------------------

export function getInvestmentsByUser(userId: number): InvestmentRecord[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM investments WHERE user_id = ? ORDER BY invested_at DESC")
    .all(userId) as InvestmentRecord[];
}

export function addInvestment(input: {
  userId: number;
  assetName: string;
  city: string;
  investedAmount: number;
  currentValue: number;
  returnsPct: number;
  unitsHeld: number;
}) {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO investments (user_id, asset_name, city, invested_amount, current_value, returns_pct, units_held)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const result = insert.run(
    input.userId,
    input.assetName,
    input.city,
    input.investedAmount,
    input.currentValue,
    input.returnsPct,
    input.unitsHeld
  );
  return db.prepare("SELECT * FROM investments WHERE id = ?").get(result.lastInsertRowid) as InvestmentRecord;
}

export function getUserPortfolioSummary(userId: number) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
         COALESCE(SUM(invested_amount), 0) AS totalInvested,
         COALESCE(SUM(current_value), 0) AS currentValue,
         COUNT(*) AS totalHoldings
       FROM investments
       WHERE user_id = ?`
    )
    .get(userId) as { totalInvested: number; currentValue: number; totalHoldings: number };

  const unrealisedGainPct =
    row.totalInvested > 0
      ? ((row.currentValue - row.totalInvested) / row.totalInvested) * 100
      : 0;

  const quarterlyYield = row.currentValue * 0.02; // ~8% annualized = ~2% quarterly

  return {
    totalInvested: row.totalInvested,
    currentValue: row.currentValue,
    unrealisedGainPct: Math.round(unrealisedGainPct * 100) / 100,
    quarterlyYield: Math.round(quarterlyYield),
    totalHoldings: row.totalHoldings,
  };
}

/**
 * Seeds realistic demo investments for a newly registered user.
 * Gives the dashboard an immediate "populated" feel.
 */
export function seedDemoInvestments(userId: number) {
  const demoAssets = [
    {
      assetName: "Embassy Manyata Tech Park — Block G",
      city: "Bangalore",
      investedAmount: 15_75_000,
      currentValue: 17_13_000,
      returnsPct: 8.76,
      unitsHeld: 150,
    },
    {
      assetName: "Prestige Tech Park — Tower 9",
      city: "Bangalore",
      investedAmount: 12_00_000,
      currentValue: 12_96_000,
      returnsPct: 8.0,
      unitsHeld: 100,
    },
    {
      assetName: "DLF Cyber City — Horizon Centre",
      city: "Gurugram",
      investedAmount: 11_36_000,
      currentValue: 11_05_600,
      returnsPct: -2.68,
      unitsHeld: 80,
    },
    {
      assetName: "Mindspace REIT — Commerzone",
      city: "Hyderabad",
      investedAmount: 5_88_000,
      currentValue: 6_38_400,
      returnsPct: 8.57,
      unitsHeld: 60,
    },
    {
      assetName: "Phoenix Mills — Lower Parel",
      city: "Mumbai",
      investedAmount: 7_40_000,
      currentValue: 7_68_800,
      returnsPct: 3.89,
      unitsHeld: 40,
    },
  ];

  for (const asset of demoAssets) {
    addInvestment({ userId, ...asset });
  }
}
