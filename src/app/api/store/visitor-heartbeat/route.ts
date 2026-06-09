import { NextRequest, NextResponse } from "next/server";
import { getTenantFromRequest } from "@/lib/tenant";
import { trackVisitor } from "@/lib/visitor-tracker";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ message: "Sessão inválida" }, { status: 400 });
    }
    const tenant = getTenantFromRequest(req);
    trackVisitor(tenant, sessionId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
