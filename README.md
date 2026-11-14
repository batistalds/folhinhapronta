# Folhinha Pronta

Loja online da Folhinha Pronta — atividades infantis em PDF prontas para
imprimir (alfabetização, números, rotina, livros de colorir e kits).
React + Vite + Tailwind no frontend; Supabase (Postgres, Storage, Edge
Functions) + Stripe Checkout (cartão e Pix) no backend.

- Site: https://folhinhapronta.pages.dev (Cloudflare Pages)
- Repositório: https://github.com/batistalds/folhinhapronta

## Stack

- React 19 + Vite, React Router (`/`, `/sucesso`, `/cancelado`, `/termos`, `/privacidade`)
- Tailwind CSS 3 + componentes no estilo shadcn/ui (Radix), Framer Motion
- Supabase: Postgres com RLS, bucket privado `pdfs`, Edge Functions em Deno
- Stripe Checkout (pagamento único, cartão + Pix)
- Brevo (API transacional: e-mail de confirmação e aviso de venda)
- Cloudflare Pages (deploy automático a cada push na `master`)

## Estrutura

```
src/
  components/   ui/ (primitivos), layout/ (Header, Footer, ScrollToTop),
                cart/ (CartDrawer), sections/ (Hero, Promotions, Products,
                Testimonials, FAQ, CountdownTimer)
  context/      CartContext (carrinho, 1 unidade por produto), ToastContext
  data/         products.js, promotions.js (catálogo e kits), faq.js,
                testimonials.js (vazio = seção oculta), site.js (contato público)
  hooks/        useCountdown (contagem até a data real PROMO_END_AT)
  pages/        Home, Success, Cancelled, legal/ (Termos, Privacidade)
public/_redirects   SPA no Cloudflare Pages (/* → /index.html)

supabase/
  migrations/   0001 schema · 0004 catálogo real · 0005 nova marca · 0006 pagamento/e-mails
  functions/
    create-checkout-session/  valida o carrinho, cria o pedido e a sessão da Stripe
    webhook-stripe/           confirma pagamento (cartão/Pix) e envia e-mails
    get-order-status/         usado pela /sucesso para gerar os links de download
    _shared/                  CORS e envio de e-mail (Brevo)
scripts/upload-pdfs.ps1      envia os PDFs de pdf/site/ para o bucket "pdfs"
```

## Rodar localmente

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` e preencha as variáveis `VITE_*`. O carrinho
funciona sem configuração; o botão "Finalizar compra" precisa das Edge
Functions publicadas.

## Variáveis de ambiente

| Variável | Onde é usada | Onde obter |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend (Cloudflare Pages) | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Frontend (Cloudflare Pages) | Supabase → Project Settings → API (chave `anon public`) |
| `STRIPE_SECRET_KEY` | Edge Functions | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `webhook-stripe` | Stripe → Developers → Webhooks → endpoint → *Signing secret* |
| `SITE_URL` | Edge Functions (links de retorno da Stripe e do e-mail) | URL pública do site, ex.: `https://folhinhapronta.pages.dev` (sem barra no final) |
| `BREVO_API_KEY` | `webhook-stripe` (e-mails) | brevo.com → SMTP & API → API keys |
| `EMAIL_FROM_NAME` | `webhook-stripe` (nome do remetente) | `Folhinha Pronta` |
| `EMAIL_FROM_ADDRESS` | `webhook-stripe` (remetente e reply-to) | `folhinhapronta@gmail.com` — precisa estar verificado como *sender* no Brevo |
| `CONTACT_EMAIL` | `webhook-stripe` (aviso de nova venda) | e-mail interno que recebe as notificações; nunca aparece no site |

Os segredos ficam **só** nos secrets do Supabase (`supabase secrets set NOME=valor`)
— nunca em `.env` commitado nem no frontend. `SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` já existem automaticamente nas Edge Functions.

**E-mails:** quando um pedido vira `paid`, o `webhook-stripe` envia ao cliente o
link da página `/sucesso` da compra e manda um aviso de venda para
`CONTACT_EMAIL` (com reply-to = e-mail do cliente). A confirmação lista os
materiais (inclusive os PDFs de cada kit) e tem reply-to = `EMAIL_FROM_ADDRESS`.
O envio usa a API HTTP do Brevo porque as Edge Functions bloqueiam SMTP.
Sem `BREVO_API_KEY`/`EMAIL_FROM_ADDRESS` o envio é pulado (fica só um
aviso no log) e a venda continua funcionando normalmente.

## Deploy

**Frontend:** push na `master` → Cloudflare Pages publica sozinho
(build `npm run build`, saída `dist`).

**Banco e funções** (Supabase CLI, com `supabase login` e `supabase link` feitos):

```bash
npx supabase db push --remote
npx supabase functions deploy create-checkout-session --remote
npx supabase functions deploy get-order-status --remote
npx supabase functions deploy webhook-stripe --no-verify-jwt --remote
```

O webhook usa `--no-verify-jwt` porque quem chama é a Stripe, não o frontend.

**PDFs:** coloque os arquivos em `pdf/site/<categoria>/<arquivo>.pdf` (pasta
ignorada pelo git) e rode `powershell -ExecutionPolicy Bypass -File scripts\upload-pdfs.ps1`.
O caminho dentro do bucket precisa ser igual ao `storage_path` do produto.

## Stripe

1. Não é preciso criar produtos/preços na Stripe: a função monta os itens a
   partir da tabela `products` a cada checkout.
2. **Pix:** ative em Settings → Payment methods. Se o Pix não estiver
   disponível, o checkout cai automaticamente para só cartão.
3. **Webhook:** endpoint `https://<project-ref>.supabase.co/functions/v1/webhook-stripe`
   com os eventos `checkout.session.completed`, `checkout.session.expired`,
   `checkout.session.async_payment_succeeded` e `checkout.session.async_payment_failed`.
4. As funções fixam a API da Stripe em `2024-06-20` (versões novas não aceitam
   `payment_method_types` no Checkout).
5. Teste com o cartão `4242 4242 4242 4242` (qualquer data futura e CVC).

## Fluxo de pagamento

1. O cliente monta o carrinho (cada produto entra uma vez) e clica em "Finalizar compra".
2. `create-checkout-session` ignora ids repetidos, recalcula os preços pela
   tabela `products` (só produtos `active`), cria o pedido `pending` + itens e
   abre a sessão da Stripe (cartão + Pix).
3. Cartão: `checkout.session.completed` com `payment_status = paid` → pedido `paid`.
   Pix: o pedido fica `pending` até `checkout.session.async_payment_succeeded`
   (`paid`) ou `async_payment_failed` (`failed`). Sessão expirada → `failed`.
4. O webhook é idempotente (só muda para `paid` se ainda não estiver) e, na
   transição, envia os e-mails em segundo plano.
5. A `/sucesso` consulta `get-order-status`; packs são expandidos em um link
   por PDF. Cada link assinado vale 30 minutos; abrir a página de novo gera
   novos links. Para Pix, a página continua verificando por ~15 minutos.

## Segurança dos dados

`orders` e `order_items` não têm política pública de RLS — todo acesso passa
pelas Edge Functions com a service role. `products` tem só leitura pública.
O bucket `pdfs` é privado: os downloads existem apenas como *signed URLs*
temporárias, geradas depois de o pagamento ser confirmado.
