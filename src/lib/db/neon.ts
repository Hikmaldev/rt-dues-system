import { neon } from "@neondatabase/serverless";

function getCleanDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const clean = url.trim().replace(/^["']|["']$/g, "");
  if (
    clean.length === 0 ||
    clean.includes("your-neon-database-url") ||
    (!clean.startsWith("postgres://") && !clean.startsWith("postgresql://"))
  ) {
    return null;
  }
  return clean;
}

/**
 * Checks if a valid Neon DATABASE_URL is configured in environment variables.
 */
export function isNeonConfigured(): boolean {
  return Boolean(getCleanDatabaseUrl());
}

/**
 * Returns a Neon Serverless SQL client or null if not configured.
 */
export function getSql() {
  const cleanUrl = getCleanDatabaseUrl();
  if (!cleanUrl) {
    return null;
  }
  return neon(cleanUrl);
}

/**
 * Executes a parameterized SQL query against Neon Postgres.
 */
export async function queryNeon<T = any>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Neon DATABASE_URL is not configured.");
  }
  const result = await (sql as any).query(text, params);
  return result as T[];
}
