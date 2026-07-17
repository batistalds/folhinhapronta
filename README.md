# Aprendemais

Landing page de vendas da Aprendemais — materiais escolares em PDF (fichas,
exercícios, resumos, planos de aula). React + Vite + Tailwind + shadcn/ui no
frontend, Supabase (Postgres, Storage, Edge Functions) + Stripe Checkout no
backend.

## Stack

- React 19 + Vite
- Tailwind CSS 3 + componentes no estilo shadcn/ui (Radix primitives)
- Framer Motion (animações, cronómetro, transições)
- React Router (`/`, `/sucesso`, `/cancelado`)
- Supabase (Postgres + RLS, Storage privado, Edge Functions em Deno)
- Stripe Checkout (modo pagamento único, hospedado pela Stripe)

## Estrutura

```
src/
  components/
    ui/          shadcn-style primitives (button, card, sheet, accordion, tabs, skeleton, badge)
    layout/      Header, Footer
    cart/        CartDrawer
    sections/    Hero, Promotions, Products, Testimonials, FAQ + subcomponentes
  context/       CartContext (estado do carrinho), ToastContext (notificações)
  data/          catálogo mockado (products.js, promotions.js) + testimonials/faq
  hooks/         useCountdown (cronómetro em loop)
  lib/           supabaseClient.js, utils.js (cn, formatPrice)
  pages/         Home, Success, Cancelled

supabase/
  migrations/0001_init.sql   schema (products, orders, order_items) + RLS + bucket "pdfs"
  seed.sql                   dados de exemplo alinhados com src/data/products.js e promotions.js
  functions/
    create-checkout-session/ cria a encomenda + a Stripe Checkout Session
    webhook-stripe/          confirma o pagamento via webhook da Stripe
    get-order-status/        usado pela página /sucesso para obter downloads
```

## Como correr localmente

```bash
npm install
npm run dev
```

O site abre com o catálogo mockado (`src/data/`). O carrinho funciona
imediatamente sem qualquer configuração — só o botão "Finalizar compra"
precisa das variáveis de ambiente e das Edge Functions descritas abaixo.

## Variáveis de ambiente

Copia `.env.example` para `.env` e preenche:

| Variável | Onde é usada | Onde obter |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase → Project Settings → API (chave `anon public`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend (opcional, não usada diretamente pois o checkout é feito no Stripe-hosted) | Stripe Dashboard → Developers → API keys |
| `STRIPE_SECRET_KEY` | Só na Edge Function | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Só na Edge Function | Stripe Dashboard → Developers → Webhooks (ver passo abaixo) |

**A `STRIPE_SECRET_KEY` nunca deve ir para o ficheiro `.env` do frontend nem
ser commitada.** É configurada apenas como *secret* das Edge Functions do
Supabase (ver abaixo).

## Passos manuais — Supabase

1. **Correr as migrations.** No SQL Editor do projeto Supabase, corre por
   ordem:
   - `supabase/migrations/0001_init.sql` (schema + RLS + criação do bucket)
   - `supabase/seed.sql` (opcional — dados de exemplo)

   Ou, com o Supabase CLI instalado e o projeto ligado (`supabase link`):
   ```bash
   supabase db push
   ```

2. **Confirmar o bucket `pdfs`.** A migration já o cria como privado
   (`public: false`). Confirma em Storage → pdfs que aparece como privado.
   Faz upload dos PDFs reais respeitando os caminhos definidos na coluna
   `storage_path` de cada produto em `supabase/seed.sql` (ex:
   `matematica/fracoes-4ano.pdf`). Os packs promocionais são entregues como
   um único PDF/ZIP combinado — ajusta `storage_path` se preferires outra
   estrutura.

3. **Configurar os secrets das Edge Functions.** Com o Supabase CLI:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
   supabase secrets set SITE_URL=http://localhost:5173
   ```
   (`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já existem automaticamente
   no ambiente das Edge Functions — não precisas de os definir.)

   Em produção, atualiza `SITE_URL` para o domínio real (é usado para gerar
   os `success_url`/`cancel_url` da Stripe).

4. **Deploy das Edge Functions:**
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy webhook-stripe --no-verify-jwt
   supabase functions deploy get-order-status
   ```
   O webhook usa `--no-verify-jwt` porque quem o chama é a Stripe, não o
   teu frontend autenticado com a anon key.

## Passos manuais — Stripe

1. Cria uma conta/projeto Stripe (usa o modo *Test* enquanto desenvolves).
2. Não é necessário pré-criar Produtos/Preços no dashboard — a Edge Function
   `create-checkout-session` cria os `price_data` dinamicamente a partir da
   tabela `products` do Supabase em cada checkout.
3. **Configurar o webhook:**
   - Dashboard → Developers → Webhooks → *Add endpoint*
   - URL: `https://<project-ref>.supabase.co/functions/v1/webhook-stripe`
   - Evento a subscrever: `checkout.session.completed` (e opcionalmente
     `checkout.session.expired`)
   - Copia o *Signing secret* (`whsec_...`) gerado e define-o como
     `STRIPE_WEBHOOK_SECRET` no passo anterior.
4. Usa os [cartões de teste da Stripe](https://stripe.com/docs/testing) para
   validar o fluxo completo (ex: `4242 4242 4242 4242`).

## Fluxo de pagamento

1. O cliente monta o carrinho na landing page (estado local via `CartContext`).
2. Ao clicar "Finalizar compra", o frontend chama a Edge Function
   `create-checkout-session` com os IDs e quantidades do carrinho.
3. A função valida os IDs e recalcula os preços a partir da tabela
   `products` (nunca confia em preços vindos do browser), cria a `order`
   (status `pending`) + `order_items`, abre uma Stripe Checkout Session e
   devolve o `checkoutUrl`.
4. O frontend redireciona para essa URL (página de pagamento da própria
   Stripe).
5. Após o pagamento, a Stripe redireciona para `/sucesso?session_id=...` e
   dispara o webhook `checkout.session.completed`.
6. O webhook (`webhook-stripe`) valida a assinatura e marca a `order` como
   `paid`.
7. A página `/sucesso` chama `get-order-status` com o `session_id` (com
   *polling* de alguns segundos caso o webhook ainda não tenha chegado) e
   mostra um link de download assinado (válido 30 min) por cada material
   comprado.

## Nota sobre segurança dos dados

As tabelas `orders` e `order_items` não têm nenhuma política pública de RLS
— não há sistema de contas nesta loja, por isso não existe um "dono do
registo" autenticável no browser. Todo o acesso passa pelas Edge Functions,
que usam a service role e ignoram RLS. A tabela `products` tem leitura
pública (é o catálogo da loja) mas nenhuma escrita pública. O bucket `pdfs`
é privado — os downloads só existem como *signed URLs* temporários gerados
pela Edge Function depois de confirmado o pagamento.
