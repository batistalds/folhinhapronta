-- Dados de exemplo para a tabela public.products.
-- Os IDs correspondem exatamente aos usados em src/data/products.js e
-- src/data/promotions.js no frontend — mantém-nos sincronizados.
--
-- storage_path assume que vais carregar os PDFs correspondentes no bucket
-- privado "pdfs" com esta mesma estrutura de pastas. Os packs promocionais
-- são entregues como um único PDF/ZIP combinado (fulfillment simplificado
-- para este MVP).
--
-- Nota: isto vive como migration (em vez de supabase/seed.sql) porque
-- `supabase db push` não corre o seed.sql em projetos remotos sem Docker
-- local — só em `supabase db reset` local. supabase/seed.sql mantém-se
-- como referência para quem usar `supabase start` localmente.

insert into public.products (id, title, description, price, category, storage_path) values
  ('mat-4ano-fracoes', 'Fichas de Frações — 4º ano', '42 páginas · 4º ano', 27.90, 'matematica', 'matematica/fracoes-4ano.pdf'),
  ('mat-5-6-numeros', 'Ficha de Números e Operações', '38 páginas · 5º e 6º ano', 27.90, 'matematica', 'matematica/numeros-operacoes-5-6.pdf'),
  ('port-gramatica-3ano', 'Gramática Divertida — 3º ano', '30 páginas · 3º ano', 27.90, 'portugues', 'portugues/gramatica-3ano.pdf'),
  ('port-interpretacao-textos', 'Interpretação de Textos', '45 páginas · 2º e 3º ciclo', 27.90, 'portugues', 'portugues/interpretacao-textos.pdf'),
  ('ciencias-corpo-humano', 'O Corpo Humano — Ficha Completa', '28 páginas · 4º e 5º ano', 27.90, 'ciencias', 'ciencias/corpo-humano.pdf'),
  ('ciencias-sistema-solar', 'Sistema Solar e Planetas', '24 páginas · 5º e 6º ano', 27.90, 'ciencias', 'ciencias/sistema-solar.pdf'),
  ('ingles-vocabulario-basico', 'Vocabulário Básico em Inglês', '20 páginas · 1º ciclo', 27.90, 'ingles', 'ingles/vocabulario-basico.pdf'),
  ('ingles-verbos-presente', 'Verbos no Presente Simples', '26 páginas · 2º ciclo', 27.90, 'ingles', 'ingles/verbos-presente.pdf'),
  ('plano-semanal-estudo', 'Plano Semanal de Estudo', '12 páginas · Todos os anos', 27.90, 'planos', 'planos/plano-semanal-estudo.pdf'),
  ('plano-aula-matematica', 'Plano de Aula — Matemática', '16 páginas · Uso do professor', 27.90, 'planos', 'planos/plano-aula-matematica.pdf'),
  ('promo-5-mais-3', 'Compra 5 materiais e ganha 3 grátis', 'Pack de 8 materiais à escolha', 29.90, 'promocao', 'promocoes/pack-5-mais-3.pdf'),
  ('promo-regresso-aulas', 'Pack Regresso às Aulas', '10 materiais essenciais para o arranque do ano', 29.90, 'promocao', 'promocoes/pack-regresso-aulas.pdf'),
  ('promo-3-mais-1', 'Compra 3, leva 1 grátis', 'Pack de 4 materiais à escolha', 29.90, 'promocao', 'promocoes/pack-3-mais-1.pdf'),
  ('promo-completo-ano', 'Pack Completo do Ano', '20 materiais, todas as disciplinas', 29.90, 'promocao', 'promocoes/pack-completo-ano.pdf')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  storage_path = excluded.storage_path;
