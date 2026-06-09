import bcrypt from "bcryptjs";
import { query, queryOne } from "./db";
import { initDatabase } from "./db-init";

const MAX_FREE_STORES = 5;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "owner";
  tenants: string[];
  plan: "free";
  active: boolean;
  createdAt: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  plan: string;
  active: boolean;
  created_at: Date;
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function getTenantDomainsForUser(userId: string): Promise<string[]> {
  const rows = await query<{ domain: string }>(
    "SELECT domain FROM user_tenants WHERE user_id = $1 ORDER BY created_at",
    [userId]
  );
  return rows.map((r) => r.domain);
}

function rowToRecord(row: UserRow, tenants: string[]): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: "owner",
    tenants,
    plan: "free",
    active: row.active,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

// ─── Queries públicas ─────────────────────────────────────────────────────────

export async function listUsers(): Promise<UserRecord[]> {
  await initDatabase();
  const rows = await query<UserRow>("SELECT * FROM users ORDER BY created_at DESC");
  return Promise.all(
    rows.map(async (row) => {
      const tenants = await getTenantDomainsForUser(row.id);
      return rowToRecord(row, tenants);
    })
  );
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  await initDatabase();
  const row = await queryOne<UserRow>(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  if (!row) return null;
  const tenants = await getTenantDomainsForUser(row.id);
  return rowToRecord(row, tenants);
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  await initDatabase();
  const row = await queryOne<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  if (!row) return null;
  const tenants = await getTenantDomainsForUser(row.id);
  return rowToRecord(row, tenants);
}

export async function getUserTenants(userId: string): Promise<string[]> {
  await initDatabase();
  return getTenantDomainsForUser(userId);
}

export async function canUserCreateStore(userId: string): Promise<boolean> {
  await initDatabase();
  const row = await queryOne<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM user_tenants WHERE user_id = $1",
    [userId]
  );
  return parseInt(row?.count ?? "0", 10) < MAX_FREE_STORES;
}

// ─── Mutações ─────────────────────────────────────────────────────────────────

/**
 * Cria uma nova conta de owner.
 * Lança "EMAIL_TAKEN" se o e-mail já existir.
 */
export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  await initDatabase();

  const emailNorm = params.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(params.password, 10);
  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  try {
    const row = await queryOne<UserRow>(
      `INSERT INTO users (id, name, email, password_hash, role, plan, active)
       VALUES ($1, $2, $3, $4, 'owner', 'free', true)
       RETURNING *`,
      [id, params.name.trim(), emailNorm, passwordHash]
    );
    if (!row) throw new Error("INSERT sem retorno");
    return rowToRecord(row, []);
  } catch (err: unknown) {
    // Violação de UNIQUE no email → código PostgreSQL 23505
    if ((err as { code?: string }).code === "23505") {
      throw new Error("EMAIL_TAKEN");
    }
    throw err;
  }
}

/**
 * Verifica email + senha.
 * Retorna o UserRecord se válido e ativo, ou null.
 */
export async function verifyUserPassword(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

/**
 * Vincula um domínio de tenant a um usuário.
 * Idempotente — ON CONFLICT DO NOTHING.
 */
export async function linkTenantToUser(userId: string, domain: string): Promise<void> {
  await initDatabase();
  await query(
    "INSERT INTO user_tenants (user_id, domain) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userId, domain]
  );
}

/**
 * Remove um domínio de TODOS os vínculos de usuários.
 * Chamado quando um tenant é excluído.
 */
export async function unlinkTenantFromAllUsers(domain: string): Promise<void> {
  await initDatabase();
  await query("DELETE FROM user_tenants WHERE domain = $1", [domain]);
}

/**
 * Retorna o userId do dono de um tenant (ou null se for loja do master).
 */
export async function findOwnerOfTenant(domain: string): Promise<string | null> {
  await initDatabase();
  const row = await queryOne<{ user_id: string }>(
    "SELECT user_id FROM user_tenants WHERE domain = $1 LIMIT 1",
    [domain]
  );
  return row?.user_id ?? null;
}
