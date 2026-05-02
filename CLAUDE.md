# CLAUDE.md — Awer Website

> Este arquivo é a fonte de verdade para qualquer trabalho neste repositório. Deve ser atualizado sempre que houver mudanças relevantes na arquitetura, stack, convenções ou decisões de projeto.

---

## Visão Geral do Projeto

**Awer Consultoria** — empresa brasileira de tecnologia e consultoria.
Este repositório é o site institucional + plataforma SaaS com:
- Páginas de marketing e cases
- Sistema de suporte ao cliente (Help Awer)
- Dashboard de analytics do cliente
- Gestão de assinaturas via Stripe
- Painel administrativo interno

**GitHub:** https://github.com/chouzzy/awer-website  
**Deploy:** Vercel (inferido pelo `.vercel` no `.gitignore`)  
**Idioma:** Português (pt-BR) — todo o conteúdo e nomenclatura de rotas  
**Backend:** `D:\awer\botrt-backend` — Express + MongoDB + Prisma, porta 3333, deploy Heroku

---

## Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 15.3.1 |
| Runtime UI | React | 19.0.0 |
| Linguagem | TypeScript (strict) | 5.x |
| UI / Design System | Chakra UI | 3.16.1 |
| CSS-in-JS | Emotion | 11.14.0 |
| Animações | Framer Motion | 12.15.0 |
| Animações Lottie | lottie-react | 2.4.1 |
| Carrossel | Swiper | 11.2.8 |
| Ícones | React Icons | 5.5.0 |
| Temas dark/light | next-themes | 0.4.6 |
| Formulários | React Hook Form + Zod | 7.72.0 / 4.3.6 |
| Auth | Auth0 (`@auth0/auth0-react`) | 2.3.0 |
| Banco de dados | MongoDB (driver nativo, sem ORM) | 7.1.1 |
| Pagamentos | Stripe | 18.5.0 |
| HTTP Client | Axios | 1.9.0 |
| Storage | AWS SDK → DigitalOcean Spaces | 3.x |
| 3D | React Three Fiber + Three.js | 9.1.2 / 0.176.0 |
| Gráficos | Chart.js | 4.5.0 |
| Analytics | Vercel Analytics + Google Tag Manager | 1.6.1 |

**Sem Tailwind CSS** — estilização exclusivamente via Chakra UI.  
**ESLint desativado** — `eslint.config.mjs` exporta objeto vazio.  
**Sem testes** — nenhum framework de testes configurado.

---

## Estrutura de Pastas

```
src/
├── actions/          # Server Actions do Next.js
│   ├── tickets.ts    # CRUD de tickets de suporte
│   └── users.ts      # Upsert de usuários Auth0 → MongoDB
├── app/              # App Router (páginas e API routes)
├── components/
│   ├── layout/       # Header, Footer, seções da landing page
│   ├── ui/           # Componentes reutilizáveis genéricos
│   └── providers/    # Context providers (Auth0, tema)
├── contexts/
│   └── ProfileContext.tsx  # Contexto global de perfil de usuário
├── data/             # Conteúdo estático (cases, depoimentos, serviços...)
├── lib/
│   ├── mongodb.ts    # Singleton do cliente MongoDB (com cache HMR)
│   └── fileService.ts # Upload/delete no DigitalOcean Spaces
├── services/
│   └── axios.ts      # Instância Axios configurada (localhost:3000)
├── types/            # Interfaces TypeScript globais
├── utils/            # slugify, links sociais, WhatsApp
└── theme.ts          # Tokens de cor customizados do Chakra UI
```

**Convenções de nomenclatura:**
- Componentes: PascalCase (`FeedbacksCarousel.tsx`)
- Pastas de componentes: agrupadas por feature/seção
- Sufixos `bkp` / `ST` = backups/staging — não usar em produção
- Path alias: `@/*` → `./src/*`

---

## Rotas da Aplicação

### Públicas (marketing)
| Rota | Página |
|------|--------|
| `/` | Homepage (Main, Cases, Produtos, About, Feedbacks) |
| `/nossa-historia` | História da empresa |
| `/politica-de-privacidade` | Política de privacidade |
| `/tecnologia` | Hub de tecnologia |
| `/tecnologia/ai` | Serviços de IA |
| `/tecnologia/aplicativos-web` | Apps web |
| `/tecnologia/botrt` | Produto BotRT |
| `/tecnologia/crawlers` | Web crawlers |
| `/tecnologia/ecommerce` | E-commerce |
| `/tecnologia/landing-pages` | Landing pages |
| `/consultoria` | Consultoria |
| `/help` | Sistema de suporte (client-side filtering) |
| `/help/[id]` | Detalhe do ticket |

### Autenticadas
| Rota | Página |
|------|--------|
| `/dashboard` | Analytics do cliente (requer Auth0) |
| `/minha-conta` | Assinatura e perfil |

### Admin (layout group `(admin)`)
| Rota | Página |
|------|--------|
| `/(admin)/awer-admin/tickets` | Gestão de tickets — admin |
| `/(admin)/awer-admin/tickets/[id]` | Detalhe do ticket — admin |

### API Routes
| Endpoint | Método | Função |
|----------|--------|--------|
| `/api/checkout` | POST | Cria sessão Stripe Checkout |
| `/api/get-something` | GET | Placeholder |

### SEO
- `/robots.ts` — gera `robots.txt`
- `/sitemap.ts` — gera sitemap XML

---

## Banco de Dados (MongoDB)

**Database:** `help_awer`  
**Conexão:** Via variável `HELPAWER_DATABASE_URL` (singleton com cache global para HMR)

### Coleções

**`users`** — Usuários Auth0 sincronizados
- Upsert via `getOrCreateMongoUser()` em `src/actions/users.ts`

**`tickets`** — Tickets de suporte
```ts
{
  _id: ObjectId,
  title: string,
  description: string,
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
  clientId: ObjectId,
  status: "OPEN" | ...,
  attachments: [{ url, fileName, mimeType, uploadedAt }],
  messages: [{ id, content, senderName, senderRole: "ADMIN" | "CLIENT", createdAt }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Autenticação (Auth0)

- Provider: `Auth0ProviderWithHistory` em `src/components/providers/`
- Hook: `useAuth0()` para tokens e estado de login
- Após login Auth0, usuário é sincronizado ao MongoDB via server action
- Contexto `ProfileContext` expõe `{ email, isAwerClient }` globalmente
- Access token enviado como `Bearer` nas chamadas à API externa

---

## Pagamentos (Stripe)

- Checkout via `/api/checkout` — cria sessão com período de trial
- Trial: `NEXT_PUBLIC_TRIAL_DAYS` dias (atualmente 7)
- Campos customizados no checkout: CNPJ e Inscrição Estadual (obrigatório BR)
- Produto principal: BotRT (IDs em `NEXT_PUBLIC_STRIPE_BOTRT_*`)
- Ambientes test e live configurados via variáveis de ambiente

---

## Storage (DigitalOcean Spaces)

- Usado para anexos de tickets
- SDK: AWS S3 (`@aws-sdk/client-s3`)
- Funções em `src/lib/fileService.ts`
- Pasta de upload configurada por `SPACES_APP_FOLDER`

---

## Variáveis de Ambiente

### Públicas (`NEXT_PUBLIC_*`)
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_AUTH0_DOMAIN
NEXT_PUBLIC_AUTH0_AUDIENCE
NEXT_PUBLIC_AUTH0_CLIENT_ID
NEXT_PUBLIC_API_BASE_URL        # URL da API backend externa
NEXT_PUBLIC_STRIPE_*_TEST       # Chaves Stripe test
NEXT_PUBLIC_STRIPE_*            # Chaves Stripe live
NEXT_PUBLIC_STRIPE_BOTRT_*      # Price IDs do produto BotRT
NEXT_PUBLIC_DOWNLOAD_LINK       # Link de download (Google Drive)
NEXT_PUBLIC_TRIAL_DAYS          # Dias de trial (7)
```

### Secretas (server-only)
```
STRIPE_SECRET_KEY_TEST
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET*
NEXT_PUBLIC_AUTH0_CLIENT_SECRET  # ⚠️ INCORRETAMENTE prefixado como público
HELPAWER_DATABASE_URL            # MongoDB connection string
SPACES_ENDPOINT
SPACES_BUCKET_NAME
SPACES_ACCESS_KEY
SPACES_SECRET_KEY
SPACES_APP_FOLDER
```

> **⚠️ ATENÇÃO SEGURANÇA:** O arquivo `.env` está commitado no Git com segredos em texto puro. Mover para variáveis de ambiente do Vercel e adicionar `.env` ao `.gitignore` é prioridade.

---

## Tema e Design

Arquivo: `src/theme.ts`

### Paleta de Cores
- **Brand (Awer):** escala de vermelho
- **BotRT:** `boTrtDarkBlue`, `boTrtRed`, `boTrtLightRed`, `boTrtCharcoal`, `boTrtGhostWhite`
- **Sociais:** `whatsappColor`, `instagramColor`, `linkedinColor`

### Padrões de Layout
- Chakra `Flex`, `VStack`, `HStack`, `Card` são os primitivos principais
- Framer Motion encapsula componentes Chakra para animações
- Suporte a dark/light mode via `ColorModeProvider` + `next-themes`

---

## Utilitários Globais

`src/utils/index.ts`:
- `slugify(text)` — slug URL (remove acentos e caracteres especiais)
- `scrollToSection(id)` — scroll suave para elemento
- `whatsappLink(message?)` — link WhatsApp com número da empresa
- `instagramLink()`, `linkedinLink()`, `mailLink()` — links sociais
- Constantes: `whatsappNumber`, `email`, URLs sociais, link do Maps

---

## Integração com o Backend (botrt-backend)

**Repositório backend:** `D:\awer\botrt-backend`  
**URL base:** configurada em `NEXT_PUBLIC_API_BASE_URL`  
**Auth:** JWT Auth0 enviado como `Authorization: Bearer {token}`

### Endpoints do backend consumidos pelo frontend

| Endpoint | Método | Arquivo frontend | Status |
|----------|--------|-----------------|--------|
| `/api/users` | GET | `src/contexts/ProfileContext.tsx:~44` | Backend implementado |
| `/api/subscription/details` | GET | `src/app/minha-conta/page.tsx:~54` | Backend implementado |
| `/api/stripe/create-portal-session` | POST | `src/app/minha-conta/page.tsx:~85` | Backend implementado |
| `/api/dashboard` | GET | `src/app/dashboard/page.tsx` | Backend implementado |

> Os TODOs do frontend mencionando "Criar este endpoint no backend" já existem no backend (`D:\awer\botrt-backend`). O frontend só precisa apontar `NEXT_PUBLIC_API_BASE_URL` corretamente.

### Campo `isAwerClient`
Retornado por `GET /api/users`. O frontend acessa via `useProfile()` de `ProfileContext` para controlar acesso ao dashboard.

### Fluxo de autenticação completo
1. Usuário loga via Auth0 SDK (frontend)
2. Auth0 dispara post-registration hook → `POST /api/users` no backend (cria usuário no MongoDB)
3. Frontend obtém JWT do Auth0 e envia como Bearer token nas chamadas ao backend
4. Backend valida JWT com `checkJwt` (express-oauth2-jwt-bearer, RS256)

---

## Rastreamento de Eventos (GTM)

Utilitário centralizado em `src/lib/analytics.ts` — função `trackEvent({ event, ...params })`.

### Eventos implementados

| Evento | Onde é disparado |
|--------|-----------------|
| `plan_select` | Seleção de plano no BotRT (`Plans.tsx`) |
| `checkout_start` | Início do checkout Stripe (`Plans.tsx`) |
| `login_click` | Botão Entrar no Header e redirect para login no BotRT |
| `cta_click` | Botão "Teste grátis" na seção CTA do BotRT |
| `service_click` | "Saiba Mais" no ProductCarousel e cards nos hubs |
| `contact_form_submit` | Submit do formulário de contato (`Contact.tsx`) |
| `whatsapp_click` | Botão WhatsApp flutuante + botões CTA nas páginas de serviço |
| `ticket_create` | Criação de chamado de suporte (`CreateTicketForm.tsx`) |
| `ticket_message_send` | Envio de mensagem num chamado (`ClientTicketDetail.tsx`) |

Para adicionar novo evento: chamar `trackEvent({ event: 'nome_evento', ...parametros })` no componente.

---

## Sistema de Chamados (Help Awer) — Estado Atual

### Melhorias implementadas
- Toasts substituem todos os `alert()` (Chakra UI `toaster`)
- Polling automático de mensagens a cada 20s (`router.refresh()` em `ClientTicketDetail`)
- Atalho `Ctrl+Enter` para enviar mensagem
- Scroll automático para o fim das mensagens
- Sidebar com detalhes do ticket (ID, status, prioridade, contagem de mensagens)
- Indicador visual de indicador de atualização automática
- Admin: dialog de confirmação antes de alterar status
- Admin: busca por nome/email na barra de filtros
- Admin: badges de resumo por status (clicáveis para filtrar)
- Admin: toasts no lugar de `alert()`

---

## Componentes Compartilhados de Serviço

Criados em `src/components/layout/servico/`:
- `ServiceHero.tsx` — Hero com tagline, título, highlight colorido, subtítulo e CTA WhatsApp
- `ServiceFeatures.tsx` — Grid de features com ícone, título e descrição
- `ServiceCTA.tsx` — Seção de call-to-action final com botão WhatsApp

Todos os componentes aceitam `trackingId` para rastrear origem do clique.

---

## Páginas Implementadas (antes em construção)

| Rota | Conteúdo |
|------|---------|
| `/consultoria` | Hub com 6 serviços de consultoria em grid |
| `/tecnologia` | Hub com 6 soluções tecnológicas em grid |
| `/tecnologia/ai` | Página completa de IA (6 features + CTA) |
| `/tecnologia/aplicativos-web` | Página completa de apps web (6 features + CTA) |
| `/tecnologia/ecommerce` | Página completa de e-commerce headless |
| `/tecnologia/crawlers` | Página completa de web scraping |
| `/tecnologia/landing-pages` | Página completa de landing pages |
| `/gestao/gestao-estrategia` | Página completa de gestão e estratégia |
| `/gestao/comercial-vendas` | Página completa de comercial e vendas |
| `/gestao/prospeccao` | Página completa de prospecção |
| `/gestao/acompanhamento-desempenho` | Página completa de acompanhamento |
| `/gestao/gestao-financeira` | Página completa de gestão financeira |
| `/gestao/apoio-operacional` | Página completa de apoio operacional |

Todas seguem o mesmo padrão visual: dark theme, `brand.500` como accent, animações Framer Motion.

---

## TODOs em Aberto

| Arquivo | Linha | Descrição |
|---------|-------|-----------|
| `src/app/pagamento/sucesso/page.tsx` | — | Adicionar link real de download do app |

---

## Conteúdo Estático

Todo o conteúdo do site está em `src/data/`:
- `about.ts` — seção "Sobre"
- `cases.ts` — casos de sucesso
- `services.ts` — descrições dos serviços
- `testimonials.ts` — depoimentos de clientes
- `gestao.ts` — soluções de gestão
- `clientLogos.ts` — logos dos clientes
- `footer.ts`, `header.ts` — estrutura de navegação

Edite esses arquivos para atualizar o conteúdo sem mexer nos componentes.

---

## Comandos de Desenvolvimento

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm start        # Servidor de produção
npm run lint     # ESLint (atualmente desativado)
```

Scripts utilitários em `scripts/`:
- `seed.ts` — inicialização do banco de dados (executar com `tsx scripts/seed.ts`)

---

## Decisões Arquiteturais Relevantes

1. **MongoDB nativo sem ORM** — queries diretas, sem Mongoose/Prisma. Padrão de conexão singleton em `src/lib/mongodb.ts`.
2. **Server Actions para mutações** — `src/actions/` em vez de API routes para operações de escrita.
3. **`revalidatePath()`** — invalidação de cache após server actions (não usa `revalidateTag`).
4. **Conteúdo em arquivos TypeScript** — sem CMS; editar `src/data/*.ts` diretamente.
5. **Sem Tailwind** — nunca misturar classes Tailwind; usar apenas props do Chakra UI.
6. **`'use client'`** — necessário em componentes com hooks, animações ou interatividade.

---

## Como Atualizar Este Arquivo

Atualizar o `CLAUDE.md` sempre que:
- Nova rota ou página for adicionada
- Nova dependência significativa for instalada
- Novo padrão de dados ou coleção MongoDB for criado
- Variável de ambiente nova for adicionada
- Decisão arquitetural relevante for tomada
- TODO em aberto for resolvido
