# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps

# sharp (image optimization) requer libs nativas no Alpine
RUN apk add --no-cache libc6-compat python3 make g++ openssl

WORKDIR /app
COPY package.json package-lock.json ./

# npm ci garante instalação exata do package-lock (inclui compilação do sharp para linux/amd64)
RUN --mount=type=cache,target=/root/.npm npm ci

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis públicas precisam estar disponíveis em build-time (embutidas no bundle)
ARG NEXT_PUBLIC_MASTER_DOMAIN
ENV NEXT_PUBLIC_MASTER_DOMAIN=$NEXT_PUBLIC_MASTER_DOMAIN

ARG NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME

RUN --mount=type=cache,target=/app/.next/cache npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner

# Instalar openssl para compatibilidade com Prisma Client
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia o build e dependências com a propriedade correta do usuário nextjs
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./package.json
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./next.config.ts
COPY --chown=nextjs:nodejs --from=builder /app/prisma ./prisma

# Cria diretórios de dados com permissão correta
# (serão sobrescritos pelo volume mount, mas garante que o app inicie sem volume)
RUN mkdir -p /app/data/tenants && \
    mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/data && \
    chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
