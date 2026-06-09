# Freedom E-commerce

Plataforma de e-commerce **multi-tenant** construída com Next.js. Uma única instância serve múltiplas lojas simultaneamente, cada uma no seu próprio domínio, com checkout PIX integrado.

Donos de loja criam conta na plataforma, gerenciam suas lojas e produtos de forma independente. Você (master) administra tudo pelo painel master.

---

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para simular um tenant específico em dev, use `?__tenant=seudominio.com` na URL.  
Para limpar o override: `/?__tenant=__clear`.

---

## Deploy via EasyPanel

### 1. Serviços necessários

Crie dois serviços no EasyPanel:

| Serviço | Tipo | Observação |
|---|---|---|
| `freedom-ecom` | App (GitHub) | A aplicação Next.js |
| `freedom-db` | PostgreSQL | Banco de dados de usuários |

> **Linke o PostgreSQL ao App** em Environment → o EasyPanel injeta a `DATABASE_URL` automaticamente.

---

### 2. Método de build

O projeto usa **build padrão via GitHub** (Dockerfile incluído no repositório).  
O EasyPanel detecta o `Dockerfile` e executa o build automaticamente.

> O banco de dados é inicializado automaticamente na primeira requisição — **não é necessário rodar migrations manualmente**.

---

### 3. Variáveis de ambiente — configuração obrigatória

Configure no painel do serviço em **Environment**:

#### Banco de dados
| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL | `postgresql://user:pass@host:5432/dbname` |
| `DATABASE_SSL` | `true` se o PG exigir SSL (conexões externas) | `false` |

> Se você linkou o serviço PostgreSQL ao App no EasyPanel, a `DATABASE_URL` é injetada automaticamente.

#### Acesso master (administrador da plataforma)
| Variável | Descrição | Exemplo |
|---|---|---|
| `MASTER_EMAIL` | Seu e-mail de acesso master | `voce@email.com` |
| `MASTER_PASSWORD` | Senha do acesso master | `SenhaForte@123` |
| `MASTER_JWT_SECRET` | Segredo JWT do master (mín. 32 chars) | `string-aleatoria-longa-aqui` |
| `NEXT_PUBLIC_MASTER_DOMAIN` | Domínio do painel master (sem https://) | `painel.seudominio.com` |

> O login master usa `MASTER_EMAIL` + `MASTER_PASSWORD` — **não é uma conta criada pelo formulário de registro**. Configure esses valores no EasyPanel antes do primeiro acesso.

#### Acesso admin das lojas (fallback global)
| Variável | Descrição | Padrão |
|---|---|---|
| `ADMIN_USERNAME` | Usuário admin global das lojas | `admin` |
| `ADMIN_PASSWORD` | Senha admin global das lojas | `Admin@2024!` |
| `ADMIN_JWT_SECRET` | Segredo JWT do admin de loja (mín. 32 chars) | *(altere obrigatoriamente)* |

> Donos de loja cadastrados na plataforma podem acessar o `/admin` da sua loja usando o e-mail e senha da própria conta — sem precisar do `ADMIN_USERNAME`/`ADMIN_PASSWORD`.

---

### 4. Volumes — configuração obrigatória

O projeto persiste dados de loja em dois diretórios. **Sem os volumes, os dados são perdidos a cada redeploy.**

Configure em **Storage** do serviço App:

| Volume (nome sugerido) | Caminho no container | Tipo |
|---|---|---|
| `store-data` | `/app/data` | Volume gerenciado pelo EasyPanel |
| `store-uploads` | `/app/public/uploads` | Host Path: `/etc/easypanel/projects/freedom-ecom/uploads` |

**Passo a passo:**
1. Serviço → aba **Storage** → **+ Add Volume**
2. `store-data` → Mount Path: `/app/data` → tipo *Volume*
3. `store-uploads` → Mount Path: `/app/public/uploads` → tipo *Host Path* → `/etc/easypanel/projects/freedom-ecom/uploads`
4. Salve → **Redeploy**

> ⚠️ Monte os volumes **antes** do primeiro deploy com dados reais. Dados criados sem volume são perdidos no redeploy.

---

### 5. Configuração completa de exemplo

```env
# Banco de dados (injetado automaticamente se você linkou o PG no EasyPanel)
DATABASE_URL=postgresql://freedom:senha@freedom-db:5432/freedom

# Acesso master
MASTER_EMAIL=voce@email.com
MASTER_PASSWORD=SuaSenhaMaster@123
MASTER_JWT_SECRET=gere-uma-string-aleatoria-de-64-chars-aqui
NEXT_PUBLIC_MASTER_DOMAIN=painel.seudominio.com

# Acesso admin de loja (fallback)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SuaSenhaAdmin@123
ADMIN_JWT_SECRET=outra-string-aleatoria-de-64-chars-aqui
```

---

## Como funciona o sistema de usuários

```
Você (master)
  → login: MASTER_EMAIL + MASTER_PASSWORD
  → acessa /master-admin → vê TODAS as lojas

Dono de loja (cliente)
  → cria conta em /master-admin/login → aba "Criar Conta"
  → acessa /master-admin → vê SOMENTE suas lojas (até 5 gratuitas)
  → acessa /admin da sua loja com o mesmo e-mail e senha da conta
```

---

## Estrutura de dados

```
PostgreSQL
  ├── users          → contas da plataforma (donos de loja)
  └── user_tenants   → vínculo owner ↔ domínio de loja

/app/ (volumes montados)
  data/
    tenants/
      loja1.com.br/
        store-data.json    ← config + produtos + banners
        sales-log.json     ← log de vendas (máx. 500 entradas)
  public/
    uploads/
      loja1.com_br/        ← imagens enviadas pela loja
```

---

## Adicionar uma nova loja (como master)

1. Acesse `https://painel.seudominio.com/master-admin`
2. Clique em **+ Nova Loja** e informe o domínio
3. No DNS, crie um registro **A** apontando para o IP da VPS
4. O EasyPanel provisiona SSL automaticamente via Let's Encrypt
5. Acesse `https://loja.com.br/admin` para configurar a loja

**Não é necessário reiniciar o servidor para cada nova loja.**

---

## Deploy manual (VPS com PM2 + Nginx)

Consulte [DEPLOY.md](./DEPLOY.md) para instruções com PM2, Nginx e SSL via Certbot.

---

## Provedores de pagamento PIX suportados

| Provedor | Status |
|---|---|
| Paradise Pags | ✅ Disponível |
| OramaPay | ✅ Disponível |
| Asaas | ✅ Disponível (sandbox incluso) |
| Skale Pay | ✅ Disponível |
| HubPague | ✅ Disponível |
| Mercado Pago | 🔜 Em breve |
| PagSeguro | 🔜 Em breve |

---

## Stack técnica

- **Framework:** Next.js (App Router) + TypeScript
- **Banco de dados:** PostgreSQL (usuários da plataforma)
- **Persistência de loja:** JSON no sistema de arquivos (por tenant)
- **Autenticação:** JWT via `jose`
- **Senhas:** `bcryptjs`
- **Imagens:** `sharp` (AVIF/WebP, redimensionamento automático)
- **PIX QR Code:** `qrcode`
- **Multi-tenancy:** header `x-tenant-host` injetado pelo proxy reverso
