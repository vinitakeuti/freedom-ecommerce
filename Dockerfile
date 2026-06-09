# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:20-alpine AS deps

# sharp (image optimization) requer libs nativas no Alpine
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app
COPY package.json package-lock.json ./

# npm ci garante instalação exata do package-lock (inclui compilação do sharp para linux/amd64)
RUN npm ci

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis públicas precisam estar disponíveis em build-time (embutidas no bundle)
ARG NEXT_PUBLIC_MASTER_DOMAIN
ENV NEXT_PUBLIC_MASTER_DOMAIN=$NEXT_PUBLIC_MASTER_DOMAIN

ARG NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME

RUN npm run build

# ─── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia o build e dependências
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Cria diretórios de dados com permissão correta
# (serão sobrescritos pelo volume mount, mas garante que o app inicie sem volume)
RUN mkdir -p /app/data/tenants && \
    mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/data && \
    chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
