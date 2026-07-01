import { createClient, type Client } from "@libsql/client";
import { createHash } from "crypto";

let cachedClient: Client | null = null;

interface UserRecord {
  id: number;
  email: string;
  full_name: string;
  kyc_tier: string;
  available_balance: number;
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

export function getDb(): Client {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Please add it to your environment variables."
    );
  }

  cachedClient = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });

  return cachedClient;
}

export async function initDb() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      kyc_tier TEXT NOT NULL DEFAULT 'tier_0',
      available_balance REAL NOT NULL DEFAULT 2500000,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const userColumns = await db.execute({ sql: "PRAGMA table_info(users)" });
  const hasAvailableBalance = (userColumns.rows as Array<{ name: string }>).some(
    (column) => column.name === "available_balance"
  );

  if (!hasAvailableBalance) {
    await db.execute({
      sql: "ALTER TABLE users ADD COLUMN available_balance REAL NOT NULL DEFAULT 2500000",
    });
  }

  await db.execute(`
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
}

// Ensure tables exist on first import
const _initPromise = initDb();

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function createUser(input: {
  email: string;
  fullName: string;
  password: string;
}) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: "INSERT INTO users (email, full_name, password_hash, available_balance) VALUES (?, ?, ?, ?)",
    args: [
      input.email.toLowerCase(),
      input.fullName.trim(),
      hashPassword(input.password),
      2500000,
    ],
  });

  const row = await db.execute({
    sql: "SELECT id, email, full_name AS fullName, kyc_tier AS kycTier, available_balance AS availableBalance, created_at AS createdAt FROM users WHERE id = ?",
    args: [result.lastInsertRowid!],
  });

  return row.rows[0] as unknown as UserRecord & { fullName: string; kycTier: string; createdAt: string };
}

export async function verifyUser(input: { email: string; password: string }) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, full_name AS fullName, password_hash AS passwordHash, kyc_tier AS kycTier, available_balance AS availableBalance, created_at AS createdAt FROM users WHERE email = ?",
    args: [input.email.toLowerCase()],
  });

  const row = result.rows[0] as unknown as
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

export async function getUserById(id: string | number) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT id, email, full_name AS fullName, kyc_tier AS kycTier, available_balance AS availableBalance, created_at AS createdAt FROM users WHERE id = ?",
    args: [Number(id)],
  });

  return (result.rows[0] as unknown as
    | (UserRecord & { fullName: string; kycTier: string; availableBalance: number; createdAt: string })
    | undefined) ?? undefined;
}

export async function adjustUserBalance(userId: number, amount: number) {
  await _initPromise;
  const db = getDb();
  await db.execute({
    sql: "UPDATE users SET available_balance = available_balance + ? WHERE id = ?",
    args: [amount, userId],
  });

  const result = await db.execute({
    sql: "SELECT available_balance AS availableBalance FROM users WHERE id = ?",
    args: [userId],
  });

  return (result.rows[0] as { availableBalance: number })?.availableBalance ?? 0;
}

export async function getInvestmentById(id: number, userId: number) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM investments WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });

  return (result.rows[0] as InvestmentRecord | undefined) ?? undefined;
}

export async function updateInvestment(input: {
  id: number;
  investedAmount: number;
  currentValue: number;
  returnsPct: number;
  unitsHeld: number;
}) {
  await _initPromise;
  const db = getDb();
  await db.execute({
    sql: `UPDATE investments SET invested_amount = ?, current_value = ?, returns_pct = ?, units_held = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [
      input.investedAmount,
      input.currentValue,
      input.returnsPct,
      input.unitsHeld,
      input.id,
    ],
  });

  const result = await db.execute({
    sql: "SELECT * FROM investments WHERE id = ?",
    args: [input.id],
  });
  return result.rows[0] as InvestmentRecord;
}

export async function deleteInvestmentById(id: number) {
  await _initPromise;
  const db = getDb();
  await db.execute({
    sql: "DELETE FROM investments WHERE id = ?",
    args: [id],
  });
}

// ---------------------------------------------------------------------------
// Investment CRUD
// ---------------------------------------------------------------------------

export async function getInvestmentsByUser(userId: number): Promise<InvestmentRecord[]> {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM investments WHERE user_id = ? ORDER BY invested_at DESC",
    args: [userId],
  });
  return result.rows as unknown as InvestmentRecord[];
}

export async function addInvestment(input: {
  userId: number;
  assetName: string;
  city: string;
  investedAmount: number;
  currentValue: number;
  returnsPct: number;
  unitsHeld: number;
}) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO investments (user_id, asset_name, city, invested_amount, current_value, returns_pct, units_held)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.userId,
      input.assetName,
      input.city,
      input.investedAmount,
      input.currentValue,
      input.returnsPct,
      input.unitsHeld,
    ],
  });

  const row = await db.execute({
    sql: "SELECT * FROM investments WHERE id = ?",
    args: [result.lastInsertRowid!],
  });
  return row.rows[0] as unknown as InvestmentRecord;
}

export async function getUserPortfolioSummary(userId: number) {
  await _initPromise;
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT
       COALESCE(SUM(invested_amount), 0) AS totalInvested,
       COALESCE(SUM(current_value), 0) AS currentValue,
       COUNT(*) AS totalHoldings
     FROM investments
     WHERE user_id = ?`,
    args: [userId],
  });

  const row = result.rows[0] as unknown as { totalInvested: number; currentValue: number; totalHoldings: number };
  const user = await getUserById(userId);

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
    availableBalance: user?.availableBalance ?? 0,
  };
}


