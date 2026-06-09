import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { getTenantFromRequest } from "@/lib/tenant";
import { verifyUserPassword, findOwnerOfTenant } from "@/lib/users";

export const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    "minha-loja-admin-secret-key-change-this-in-production-2024"
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@2024!";

export async function POST(req: NextRequest) {
  try {
    const tenant = getTenantFromRequest(req);
    const { username, password, email } = await req.json();

    // Pequeno delay anti-brute-force
    await new Promise((r) => setTimeout(r, 400));

    let authorized = false;

    // ── 1. Credenciais globais (env) ──────────────────────────────────────────
    if (username && password) {
      authorized = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    }

    // ── 2. Credenciais de plataforma (dono da loja) ───────────────────────────
    // O dono da loja pode usar seu e-mail + senha da conta para acessar o /admin
    // da loja que lhe pertence.
    if (!authorized && email && password) {
      const user = await verifyUserPassword(email, password);
      if (user) {
        const ownerId = await findOwnerOfTenant(tenant);
        if (ownerId === user.id) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { message: "Usuário ou senha incorretos" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      username: username || email,
      role: "admin",
      tenant,
    };

    const token = await new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "OK" });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logout efetuado" });
  response.cookies.delete("admin_token");
  return response;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ auth: false }, { status: 401 });

  try {
    const tenant = getTenantFromRequest(req);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.tenant && payload.tenant !== tenant) {
      return NextResponse.json({ auth: false }, { status: 401 });
    }
    return NextResponse.json({ auth: true });
  } catch {
    return NextResponse.json({ auth: false }, { status: 401 });
  }
}
