import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain")?.trim().toLowerCase();
  
  if (!domain) {
    return NextResponse.json({ status: "error", message: "Domínio não informado" }, { status: 400 });
  }

  // Se for localhost ou IP local, considera OK para desenvolvimento
  if (
    domain === "localhost" ||
    domain === "127.0.0.1" ||
    domain.endsWith(".local") ||
    !domain.includes(".")
  ) {
    return NextResponse.json({ status: "ok", details: "Ambiente local" });
  }

  const result = await new Promise<"ok" | "error">((resolve) => {
    // Resolve IPv4 (registro A)
    dns.resolve4(domain, (err, addresses) => {
      if (!err && addresses && addresses.length > 0) {
        resolve("ok");
        return;
      }
      
      // Se falhar, tenta CNAME
      dns.resolveCname(domain, (cnameErr, cnames) => {
        if (!cnameErr && cnames && cnames.length > 0) {
          resolve("ok");
        } else {
          resolve("error");
        }
      });
    });
  });

  return NextResponse.json({
    status: result,
    details: result === "ok" ? "Apontamento DNS ativo" : "Sem apontamento DNS detectado",
  });
}
