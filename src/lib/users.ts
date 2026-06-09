import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const MAX_FREE_STORES = 5;

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

interface UsersFile {
  v: number;
  users: UserRecord[];
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

function readUsersFile(): UsersFile {
  if (!fs.existsSync(USERS_FILE)) return { v: 1, users: [] };
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) as UsersFile;
  } catch {
    return { v: 1, users: [] };
  }
}

function writeUsersFile(data: UsersFile): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function listUsers(): UserRecord[] {
  return readUsersFile().users;
}

export function findUserByEmail(email: string): UserRecord | null {
  return (
    readUsersFile().users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    ) ?? null
  );
}

export function findUserById(id: string): UserRecord | null {
  return readUsersFile().users.find((u) => u.id === id) ?? null;
}

export function getUserTenants(userId: string): string[] {
  return findUserById(userId)?.tenants ?? [];
}

export function canUserCreateStore(userId: string): boolean {
  const user = findUserById(userId);
  if (!user || !user.active) return false;
  return user.tenants.length < MAX_FREE_STORES;
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Creates a new owner account.
 * Throws "EMAIL_TAKEN" if the email already exists.
 */
export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  const file = readUsersFile();
  const emailNorm = params.email.toLowerCase().trim();

  if (file.users.some((u) => u.email.toLowerCase() === emailNorm)) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await bcrypt.hash(params.password, 10);
  const user: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: params.name.trim(),
    email: emailNorm,
    passwordHash,
    role: "owner",
    tenants: [],
    plan: "free",
    active: true,
    createdAt: new Date().toISOString(),
  };

  file.users.push(user);
  writeUsersFile(file);
  return user;
}

/**
 * Verifies email + password.
 * Returns the user if valid and active, or null otherwise.
 */
export async function verifyUserPassword(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const user = findUserByEmail(email);
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

/**
 * Links a tenant domain to a user account.
 * Idempotent — does nothing if already linked.
 */
export function linkTenantToUser(userId: string, domain: string): void {
  const file = readUsersFile();
  const user = file.users.find((u) => u.id === userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.tenants.includes(domain)) {
    user.tenants.push(domain);
    writeUsersFile(file);
  }
}

/**
 * Removes a domain from ALL users' tenant lists.
 * Called when a tenant is deleted.
 */
export function unlinkTenantFromAllUsers(domain: string): void {
  const file = readUsersFile();
  let changed = false;
  for (const user of file.users) {
    const before = user.tenants.length;
    user.tenants = user.tenants.filter((t) => t !== domain);
    if (user.tenants.length !== before) changed = true;
  }
  if (changed) writeUsersFile(file);
}

/**
 * Finds which userId owns a given tenant domain.
 * Returns null if no owner is found (e.g., legacy master-created stores).
 */
export function findOwnerOfTenant(domain: string): string | null {
  const { users } = readUsersFile();
  return users.find((u) => u.tenants.includes(domain))?.id ?? null;
}
