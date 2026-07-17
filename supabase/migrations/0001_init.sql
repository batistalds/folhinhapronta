-- Aprendemais — schema inicial: produtos, encomendas e itens de encomenda
-- Corre este ficheiro no SQL Editor do Supabase ou via `supabase db push`

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
-- Nota: id é um slug de texto (ex: "mat-4ano-fracoes"), não um uuid.
-- Isto permite que o catálogo mockado no frontend (src/data/products.js e
-- src/data/promotions.js) partilhe os mesmos identificadores da base de
-- dados, para que a Edge Function de checkout valide preços a partir desta
-- tabela (nunca confiando no preço enviado pelo browser) sem obrigar a
-- reescrever a landing page para ir buscar o catálogo à API.
create table if not exists public.products (
  id text primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text,
  storage_path text not null, -- caminho do PDF dentro do bucket "pdfs"
  thumbnail_url text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Leitura pública dos produtos (catálogo da landing page)
create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Nenhuma política de insert/update/delete para anon/authenticated:
-- a gestão do catálogo é feita via painel do Supabase ou service role.

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text,
  stripe_session_id text unique,
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Sem políticas públicas: não há sistema de contas/login nesta loja,
-- por isso "o dono do registo" é a própria Edge Function (service role),
-- que ignora RLS. O frontend nunca lê/escreve orders diretamente — só
-- através da Edge Function `get-order-status`.

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  price numeric(10, 2) not null check (price >= 0)
);

alter table public.order_items enable row level security;

-- Sem políticas públicas, mesma lógica de orders.

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_stripe_session_id_idx on public.orders(stripe_session_id);

-- ---------------------------------------------------------------------------
-- Storage: bucket privado para os PDFs
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', false)
on conflict (id) do nothing;

-- Sem políticas de storage.objects para anon/authenticated: o bucket é
-- privado e só a Edge Function (service role) gera signed URLs temporários.
