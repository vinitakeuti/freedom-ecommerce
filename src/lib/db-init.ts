import { getPool } from "./db";

// Garante que a migration roda exatamente uma vez, mesmo com requisições concorrentes
let initPromise: Promise<void> | null = null;

export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = runMigrations().catch((err) => {
      // Permite nova tentativa se falhar
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

async function runMigrations(): Promise<void> {
  const pool = getPool();

  await pool.query(`
    -- Tabela de usuários da plataforma
    CREATE TABLE IF NOT EXISTS users (
      id            VARCHAR(60)  PRIMARY KEY,
      name          VARCHAR(255) NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20)  NOT NULL DEFAULT 'owner',
      plan          VARCHAR(20)  NOT NULL DEFAULT 'free',
      active        BOOLEAN      NOT NULL DEFAULT true,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    -- Índice para busca por e-mail (case-insensitive via LOWER no INSERT/SELECT)
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));

    -- Tabela de vínculo usuário ↔ domínio de loja
    CREATE TABLE IF NOT EXISTS user_tenants (
      user_id    VARCHAR(60)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      domain     VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, domain)
    );

    CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants (user_id);
    CREATE INDEX IF NOT EXISTS idx_user_tenants_domain  ON user_tenants (domain);
  `);

  console.log("[db] migrations OK");
}
