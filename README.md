# Freedom E-commerce

Plataforma de e-commerce **multi-tenant** construída com Next.js. Uma única instância serve múltiplas lojas simultaneamente, cada uma no seu próprio domínio, com checkout PIX integrado (Paradise Pags, OramaPay, Asaas, Skale Pay, HubPague).

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

## Deploy via EasyPanel (recomendado)

### Método de build

O projeto usa **build padrão do EasyPanel via GitHub** (nixpacks/Node.js).  
**Não é necessário** nenhum `Dockerfile`, `nixpacks.toml` ou configuração extra — o EasyPanel detecta o projeto Next.js automaticamente e executa:

```
npm install → next build → next start
```

> **Nota sobre nixpacks:** o EasyPanel usa nixpacks como builder interno por padrão, tanto no modo GitHub quanto no modo manual. Os dois modos produzem o mesmo resultado. O build via GitHub funciona normalmente.

---

### Variáveis de ambiente obrigatórias

Configure no painel do EasyPanel em **Environment**:

| Variável | Descrição | Exemplo |
|---|---|---|
| `ADMIN_PASSWORD` | Senha do painel `/admin` de cada loja | `senha-forte-aqui` |
| `MASTER_PASSWORD` | Senha do painel `/master-admin` | `outra-senha-forte` |
| `JWT_SECRET` | Segredo para assinar tokens JWT (min. 32 chars) | `string-aleatoria-longa` |
| `NEXT_PUBLIC_MASTER_DOMAIN` | Domínio do painel master (sem https://) | `painel.seudominio.com` |

Variáveis opcionais:

| Variável | Descrição |
|---|---|
| `NEXT_IMAGE_ALLOWED_HOSTS` | Hosts externos de imagens separados por vírgula |

---

### ⚠️ Volumes — configuração obrigatória

O projeto persiste dados em dois diretórios. **Sem os volumes montados, todos os dados são perdidos ao reiniciar o container.**

Monte os volumes no EasyPanel em **Storage**:

| Volume (nome sugerido) | Caminho no container | Caminho no host (EasyPanel) |
|---|---|---|
| `store-data` | `/app/data` | automático (volume gerenciado) |
| `store-uploads` | `/app/public/uploads` | `/etc/easypanel/projects/freedom-ecom/uploads` |

**Passo a passo no EasyPanel:**

1. Acesse o serviço → aba **Storage**
2. Adicione um volume:
   - **Nome:** `store-data`
   - **Mount Path:** `/app/data`
   - Tipo: *Volume* (gerenciado pelo EasyPanel)
3. Adicione outro volume:
   - **Nome:** `store-uploads`
   - **Mount Path:** `/app/public/uploads`
   - Tipo: *Host Path*
   - **Host Path:** `/etc/easypanel/projects/freedom-ecom/uploads`
4. Salve e faça **Redeploy**

> **Por que `uploads` usa Host Path?** Para que as imagens enviadas pelas lojas sobrevivam entre deploys e possam ser acessadas diretamente pelo Nginx/proxy se necessário.

---

### Estrutura de dados no container

```
/app/
  data/
    tenants/
      loja1.com.br/
        store-data.json    ← config + produtos + banners
        sales-log.json     ← log de vendas (máx. 500 entradas)
        .registered        ← marca loja como registrada
      loja2.com.br/
        store-data.json
  public/
    uploads/
      loja1.com_br/        ← imagens da loja 1
      loja2.com_br/        ← imagens da loja 2
```

---

### Configuração do domínio master

Defina `NEXT_PUBLIC_MASTER_DOMAIN` com o domínio do painel master.  
Quando alguém acessa esse domínio, é redirecionado automaticamente para `/master-home` (landing page).

---

## Deploy manual (VPS com PM2 + Nginx)

Consulte o arquivo [DEPLOY.md](./DEPLOY.md) para instruções completas de deploy manual com PM2, Nginx e SSL via Certbot.

---

## Adicionar uma nova loja

1. Acesse `https://painel.seudominio.com/master-admin`
2. Clique em **+ Nova Loja** e informe o domínio (ex: `loja2.com.br`)
3. No provedor DNS, crie um registro **A** apontando para o IP da VPS
4. Configure SSL no painel (EasyPanel faz isso automaticamente via Let's Encrypt)
5. Acesse `https://loja2.com.br/admin` para configurar a loja

**Não é necessário reiniciar o servidor para cada nova loja.**

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

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Persistência:** JSON no sistema de arquivos (sem banco de dados)
- **Imagens:** `sharp` (AVIF/WebP, redimensionamento automático)
- **Auth:** JWT via `jose`
- **PIX QR Code:** `qrcode`
- **Multi-tenancy:** header `x-tenant-host` injetado pelo proxy reverso
