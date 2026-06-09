import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import { deleteTenant } from "@/lib/store-data";
import { unlinkTenantFromAllUsers, findOwnerOfTenant } from "@/lib/users";

const MASTER_SECRET = new TextEncoder().encode(
  process.env.MASTER_JWT_SECRET || "master-secret-change-this-in-production"
);

interface AuthPayload extends JWTPayload {
  role: "master" | "owner";
  userId?: string;
}

async function verifyToken(req: NextRequest): Promise<AuthPayload> {
  const token = req.cookies.get("master_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { payload } = await jwtVerify(token, MASTER_SECRET);
  return payload as AuthPayload;
}

/** DELETE /api/master-admin/tenants/[domain] — remove a tenant */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  let payload: AuthPayload;
  try {
    payload = await verifyToken(req);
  } catch {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { domain } = await params;
  if (!domain) {
    return NextResponse.json({ message: "Domínio não informado" }, { status: 400 });
  }

  const decodedDomain = decodeURIComponent(domain);

  // Owner só pode excluir lojas que lhe pertencem
  if (payload.role === "owner") {
    const ownerId = await findOwnerOfTenant(decodedDomain);
    if (ownerId !== payload.userId) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
    }
  }

  const deleted = deleteTenant(decodedDomain);
  if (!deleted) {
    return NextResponse.json({ message: "Loja não encontrada" }, { status: 404 });
  }

  // Remove o vínculo do tenant de todos os usuários
  await unlinkTenantFromAllUsers(decodedDomain);

  return NextResponse.json({ message: "Loja removida com sucesso" });
}
