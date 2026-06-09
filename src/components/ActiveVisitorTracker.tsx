"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ActiveVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Não rastrear acessos administrativos, checkout de painel ou chamadas de API
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/master-admin") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    // Gerar um ID de sessão único para esta aba caso não exista
    let sessionId = sessionStorage.getItem("active_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
      sessionStorage.setItem("active_session_id", sessionId);
    }

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/store/visitor-heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (err) {
        // Ignorar erros de rede silenciosamente
      }
    };

    // Enviar o heartbeat imediatamente
    sendHeartbeat();

    // E depois a cada 15 segundos
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
