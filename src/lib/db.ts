import { Pool, type QueryResultRow } from "pg";

// Singleton pool — evita múltiplos pools no hot-reload do dev
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (global.__pgPool) return global.__pgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[db] DATABASE_URL não configurado. Adicione essa variável de ambiente.");
  }

  const pool = new Pool({
    connectionString,
    // SSL desabilitado por padrão (rede interna do EasyPanel).
    // Para conexões externas, defina DATABASE_SSL=true.
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  pool.on("error", (err) => {
    console.error("[db] pool error:", err.message);
  });

  global.__pgPool = pool;
  return pool;
}

/** Executa uma query e retorna todas as linhas. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query<T>(sql, params);
  return result.rows;
}

/** Executa uma query e retorna a primeira linha (ou null). */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
