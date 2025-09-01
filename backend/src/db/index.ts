import { Pool, type QueryResultRow } from "pg";
import { config } from "../config";
import { schemaSQL } from "./schema";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl });
  }
  return pool;
}

export async function initDb(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await client.query(schemaSQL);
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[] }> {
  return getPool().query<T>(text, params as any);
}
