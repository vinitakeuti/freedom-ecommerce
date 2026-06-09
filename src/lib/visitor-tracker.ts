// tenant -> { [sessionId]: lastSeenTimestamp }
const activeSessions: Record<string, Record<string, number>> = {};

export function trackVisitor(tenant: string, sessionId: string) {
  if (!activeSessions[tenant]) {
    activeSessions[tenant] = {};
  }
  activeSessions[tenant][sessionId] = Date.now();
}

export function getActiveVisitorsCount(tenant: string): number {
  const sessions = activeSessions[tenant];
  if (!sessions) return 0;

  const now = Date.now();
  const limit = 30000; // 30 segundos de inatividade tolerados
  let count = 0;

  for (const [sessionId, lastSeen] of Object.entries(sessions)) {
    if (now - lastSeen < limit) {
      count++;
    } else {
      // Limpar sessões expiradas para evitar vazamento de memória
      delete sessions[sessionId];
    }
  }

  return count;
}
