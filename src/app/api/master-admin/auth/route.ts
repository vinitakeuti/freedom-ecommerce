import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { verifyUserPassword } from "@/lib/users";

export const MASTER_SECRET = new TextEncoder().encode(
  process.env.MASTER_JWT_SECRET || "master-secret-change-this-in-production"
);

const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "Master@2024!";
/**
 * E-mail reservado para acesso master.
 * Configure via env MASTER_EMAIL (default: master@admin).
 * Quem loga com esse e-mail + MASTER_PASSWORD recebe role "master".
 */
const MASTER_EMAIL = (process.env.MASTER_EMAIL || "master@admin").toLowerCase();

// ─── POST — login ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ message: "Senha obrigatória" }, { status: 400 });
    }

    await new Promise((r) => setTimeout(r, 400)); // breve delay anti-brute-force

    // ── Master login ──────────────────────────────────────────────────────────
    const isMasterEmail = email === MASTER_EMAIL || email === "";
    if (isMasterEmail && password === MASTER_PASSWORD) {
      const token = await new SignJWT({ role: "master" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(MASTER_SECRET);

      const res = NextResponse.json({ message: "OK", role: "master" });
      res.cookies.set("master_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 12,
        path: "/",
      });
      return res;
    }

    // ── Owner login ───────────────────────────────────────────────────────────
    if (!email) {
      // sem e-mail e senha master errada
      return NextResponse.json({ message: "E-mail e senha inválidos" }, { status: 401 });
    }

    const user = await verifyUserPassword(email, password);
    if (!user) {
      return NextResponse.json({ message: "E-mail ou senha incorretos" }, { status: 401 });
    }

    const token = await new SignJWT({
      role: "owner",
      userId: user.id,
      tenants: user.tenants,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("12h")
      .sign(MASTER_SECRET);

    const res = NextResponse.json({ message: "OK", role: "owner" });
    res.cookies.set("master_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

// ─── DELETE — logout ──────────────────────────────────────────────────────────
export async function DELETE() {
  const res = NextResponse.json({ message: "Logout efetuado" });
  res.cookies.delete("master_token");
  return res;
}

// ─── GET — verify token ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const token = req.cookies.get("master_token")?.value;
  if (!token) return NextResponse.json({ auth: false }, { status: 401 });
  try {
    const { payload } = await jwtVerify(token, MASTER_SECRET);
    return NextResponse.json({ auth: true, role: payload.role });
  } catch {
    return NextResponse.json({ auth: false }, { status: 401 });
  }
}

export { jwtVerify, MASTER_SECRET as secret };
