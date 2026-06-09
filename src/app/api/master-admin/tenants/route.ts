import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import { listTenants, createTenant, readStoreData } from "@/lib/store-data";
import { canUserCreateStore, linkTenantToUser, findUserById } from "@/lib/users";

const MASTER_SECRET = new TextEncoder().encode(
  process.env.MASTER_JWT_SECRET || "master-secret-change-this-in-production"
);

const MAX_FREE_STORES = 5;

interface AuthPayload extends JWTPayload {
  role: "master" | "owner";
  userId?: string;
  tenants?: string[];
}

async function verifyToken(req: NextRequest): Promise<AuthPayload> {
  const token = req.cookies.get("master_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { payload } = await jwtVerify(token, MASTER_SECRET);
  return payload as AuthPayload;
}

/** GET /api/master-admin/tenants — list tenants visible to the caller */
export async function GET(req: NextRequest) {
  let payload: AuthPayload;
  try {
    payload = await verifyToken(req);
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  // Master vê todas; owner vê apenas as suas
  let domains: string[];
  if (payload.role === "master") {
    domains = listTenants();
  } else if (payload.role === "owner" && payload.userId) {
    // Re-lê do arquivo para ter a lista atualizada (o JWT pode estar desatualizado)
    const user = findUserById(payload.userId);
    domains = user?.tenants ?? [];
  } else {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const tenants = domains.map((domain) => {
    try {
      const store = readStoreData(domain);
      return {
        domain,
        storeName: store.storeName,
        productCount: store.products?.length ?? 0,
        primaryColor: store.primaryColor ?? "#8b5cf6",
      };
    } catch {
      return { domain, storeName: domain, productCount: 0, primaryColor: "#8b5cf6" };
    }
  });

  return NextResponse.json(tenants);
}

/** POST /api/master-admin/tenants — create new tenant */
export async function POST(req: NextRequest) {
  let payload: AuthPayload;
  try {
    payload = await verifyToken(req);
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  if (payload.role !== "master" && payload.role !== "owner") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  // Owners: verificar limite de lojas gratuitas
  if (payload.role === "owner") {
    if (!payload.userId || !canUserCreateStore(payload.userId)) {
      return NextResponse.json(
        {
          message: `Limite de ${MAX_FREE_STORES} lojas gratuitas atingido. Entre em contato para mais lojas.`,
        },
        { status: 403 }
      );
    }
  }

  try {
    const { domain, storeName } = await req.json();

    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ message: "Domínio inválido" }, { status: 400 });
    }

    const normalized = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase()
      .trim();

    const existing = listTenants();
    if (existing.includes(normalized)) {
      return NextResponse.json({ message: "Esse domínio já existe" }, { status: 409 });
    }

    const store = createTenant(normalized, storeName, payload.userId);

    // Vincula o tenant ao usuário owner
    if (payload.role === "owner" && payload.userId) {
      linkTenantToUser(payload.userId, normalized);
    }

    return NextResponse.json(
      { domain: normalized, storeName: store.storeName },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Erro ao criar loja" }, { status: 500 });
  }
}
