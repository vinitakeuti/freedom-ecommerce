import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

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

// Converte do modelo Prisma User + relations para UserRecord esperado pelas rotas
function toUserRecord(
  user: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    plan: string;
    active: boolean;
    createdAt: Date;
  },
  tenants: string[]
): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: "owner",
    tenants,
    plan: "free",
    active: user.active,
    createdAt: user.createdAt.toISOString(),
  };
}

// ─── Queries públicas ─────────────────────────────────────────────────────────

export async function listUsers(): Promise<UserRecord[]> {
  const users = await prisma.user.findMany({
    include: { tenants: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => {
    const domains = u.tenants.map((t) => t.domain);
    return toUserRecord(u, domains);
  });
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const u = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { tenants: true },
  });
  if (!u) return null;
  const domains = u.tenants.map((t) => t.domain);
  return toUserRecord(u, domains);
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const u = await prisma.user.findUnique({
    where: { id },
    include: { tenants: true },
  });
  if (!u) return null;
  const domains = u.tenants.map((t) => t.domain);
  return toUserRecord(u, domains);
}

export async function getUserTenants(userId: string): Promise<string[]> {
  const tenants = await prisma.userTenant.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return tenants.map((t) => t.domain);
}

export async function canUserCreateStore(userId: string): Promise<boolean> {
  const count = await prisma.userTenant.count({
    where: { userId },
  });
  return count < MAX_FREE_STORES;
}

// ─── Mutações ─────────────────────────────────────────────────────────────────

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  const emailNorm = params.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(params.password, 10);
  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  try {
    const u = await prisma.user.create({
      data: {
        id,
        name: params.name.trim(),
        email: emailNorm,
        passwordHash,
        role: "owner",
        plan: "free",
        active: true,
      },
    });
    return toUserRecord(u, []);
  } catch (err: any) {
    // Código de violação de Unique no Prisma (P2002)
    if (err.code === "P2002") {
      throw new Error("EMAIL_TAKEN");
    }
    throw err;
  }
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const user = await findUserByEmail(email);
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function linkTenantToUser(userId: string, domain: string): Promise<void> {
  try {
    await prisma.userTenant.upsert({
      where: {
        userId_domain: { userId, domain },
      },
      create: {
        userId,
        domain,
      },
      update: {},
    });
  } catch (e) {
    // Ignorar se já vinculado
  }
}

export async function unlinkTenantFromAllUsers(domain: string): Promise<void> {
  await prisma.userTenant.deleteMany({
    where: { domain },
  });
}

export async function findOwnerOfTenant(domain: string): Promise<string | null> {
  const match = await prisma.userTenant.findFirst({
    where: { domain },
    select: { userId: true },
  });
  return match?.userId ?? null;
}
