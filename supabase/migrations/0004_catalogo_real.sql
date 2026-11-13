-- Catálogo real da Aprendemais (substitui os produtos de exemplo).
--
-- * storage_path: caminho do PDF dentro do bucket privado "pdfs".
--   Os arquivos são enviados pelo script scripts/upload-pdfs.ps1.
-- * bundle_items: para os packs, lista dos ids de produtos que o pack entrega.
--   Packs não têm PDF próprio (storage_path nulo); a função get-order-status
--   gera um link para cada item.
-- * active: produtos inativos não aparecem nem podem ser comprados.

alter table public.products alter column storage_path drop not null;
alter table public.products add column if not exists bundle_items text[];
alter table public.products add column if not exists active boolean not null default true;

-- Produtos de exemplo: apaga os que não têm pedidos; desativa os restantes.
delete from public.products p
 where p.id in ('mat-4ano-fracoes', 'mat-5-6-numeros', 'port-gramatica-3ano', 'port-interpretacao-textos', 'ciencias-corpo-humano', 'ciencias-sistema-solar', 'ingles-vocabulario-basico', 'ingles-verbos-presente', 'plano-semanal-estudo', 'plano-aula-matematica', 'promo-5-mais-3', 'promo-regresso-aulas', 'promo-3-mais-1', 'promo-completo-ano')
   and not exists (select 1 from public.order_items oi where oi.product_id = p.id);

update public.products set active = false
 where id in ('mat-4ano-fracoes', 'mat-5-6-numeros', 'port-gramatica-3ano', 'port-interpretacao-textos', 'ciencias-corpo-humano', 'ciencias-sistema-solar', 'ingles-vocabulario-basico', 'ingles-verbos-presente', 'plano-semanal-estudo', 'plano-aula-matematica', 'promo-5-mais-3', 'promo-regresso-aulas', 'promo-3-mais-1', 'promo-completo-ano');

insert into public.products (id, title, description, price, category, storage_path, bundle_items, active) values
  ('alfabeto-tracado', 'Alfabeto Traçado', '27 páginas · Traçado das letras', 12.90, 'alfabetizacao', 'alfabetizacao/alfabeto-tracado.pdf', null, true),
  ('vogais-tracado', 'Vogais Traçado', '6 páginas · Traçado das vogais', 9.90, 'alfabetizacao', 'alfabetizacao/vogais-tracado.pdf', null, true),
  ('forme-silabas', 'Forme Sílabas', '22 páginas · Formação de sílabas', 11.90, 'alfabetizacao', 'alfabetizacao/forme-silabas.pdf', null, true),
  ('letra-inicial', 'Letra Inicial', '27 páginas · Associação letra e imagem', 12.90, 'alfabetizacao', 'alfabetizacao/letra-inicial.pdf', null, true),
  ('troca-letra', 'Troca Letra', '10 páginas · Consciência fonológica', 9.90, 'alfabetizacao', 'alfabetizacao/troca-letra.pdf', null, true),
  ('qual-e-a-palavra', 'Qual é a Palavra?', '10 páginas · Leitura de palavras', 9.90, 'alfabetizacao', 'alfabetizacao/qual-e-a-palavra.pdf', null, true),
  ('aprende-cores', 'Aprende Cores', '11 páginas · Reconhecimento das cores', 9.90, 'numeros-formas', 'numeros-formas/aprende-cores.pdf', null, true),
  ('aprende-quantidades', 'Aprende Quantidades', '11 páginas · Contagem e quantidades', 9.90, 'numeros-formas', 'numeros-formas/aprende-quantidades.pdf', null, true),
  ('aprende-operacoes', 'Aprende Operações', '11 páginas · Primeiras continhas', 9.90, 'numeros-formas', 'numeros-formas/aprende-operacoes.pdf', null, true),
  ('mestre-das-formas', 'Mestre das Formas', '6 páginas · Formas geométricas', 9.90, 'numeros-formas', 'numeros-formas/mestre-das-formas.pdf', null, true),
  ('arco-iris-das-emocoes', 'Arco-Íris das Emoções', '6 páginas · Socioemocional', 9.90, 'atividades', 'atividades/arco-iris-das-emocoes.pdf', null, true),
  ('caderno-de-missoes-especiais', 'Caderno de Missões Especiais', '6 páginas · Desafios divertidos', 9.90, 'atividades', 'atividades/caderno-de-missoes-especiais.pdf', null, true),
  ('desafios-do-heroi', 'Desafios do Herói', '6 páginas · Raciocínio e atenção', 9.90, 'atividades', 'atividades/desafios-do-heroi.pdf', null, true),
  ('labirinto-das-ideias', 'Labirinto das Ideias', '8 páginas · Labirintos e lógica', 9.90, 'atividades', 'atividades/labirinto-das-ideias.pdf', null, true),
  ('exploradores-do-conhecimento', 'Exploradores do Conhecimento', '22 páginas · Atividades variadas', 12.90, 'atividades', 'atividades/exploradores-do-conhecimento.pdf', null, true),
  ('kit-rotina', 'Kit Rotina sem Drama', '14 páginas · Quadros, tags e rotinas manhã, tarde e noite', 14.90, 'rotina', 'rotina/kit-rotina.pdf', null, true),
  ('placas-de-banheiro', 'Placas de Banheiro', '4 páginas · Versões menina e menino', 4.90, 'rotina', 'rotina/placas-de-banheiro.pdf', null, true),
  ('livro-de-colorir-biblico', 'Livro de Colorir Bíblico', '36 páginas · Colorir com tema bíblico', 14.90, 'livros', 'livros/livro-de-colorir-biblico.pdf', null, true),
  ('livro-de-colorir-ursinhos', 'Livro de Colorir dos Ursinhos', '36 páginas · Colorir com ursinhos', 14.90, 'livros', 'livros/livro-de-colorir-ursinhos.pdf', null, true),
  ('tchau-fraldinha-menino', 'Tchau, Fraldinha! (menino)', '15 páginas · Desfralde em história', 12.90, 'livros', 'livros/tchau-fraldinha-menino.pdf', null, true),
  ('tchau-fraldinha-menina', 'Tchau, Fraldinha! (menina)', '15 páginas · Desfralde em história', 12.90, 'livros', 'livros/tchau-fraldinha-menina.pdf', null, true),
  ('a-pascoa-de-ton', 'A Páscoa de Ton, o Coelhinho do Amor', '17 páginas · Ebook de Páscoa', 12.90, 'livros', 'livros/a-pascoa-de-ton.pdf', null, true),
  ('meu-diario-com-deus', 'Meu Diário com Deus', '18 páginas · Diário cristão infantil', 14.90, 'livros', 'livros/meu-diario-com-deus.pdf', null, true),
  ('pack-completo', 'Combo Completo Aprendemais', 'Todos os 23 materiais do site: alfabetização, números, atividades, rotina e livros.', 59.90, 'pack', null, array['alfabeto-tracado', 'vogais-tracado', 'forme-silabas', 'letra-inicial', 'troca-letra', 'qual-e-a-palavra', 'aprende-cores', 'aprende-quantidades', 'aprende-operacoes', 'mestre-das-formas', 'arco-iris-das-emocoes', 'caderno-de-missoes-especiais', 'desafios-do-heroi', 'labirinto-das-ideias', 'exploradores-do-conhecimento', 'kit-rotina', 'placas-de-banheiro', 'livro-de-colorir-biblico', 'livro-de-colorir-ursinhos', 'tchau-fraldinha-menino', 'tchau-fraldinha-menina', 'a-pascoa-de-ton', 'meu-diario-com-deus'], true),
  ('pack-alfabetizacao', 'Kit Alfabetização', 'Os 6 cadernos de alfabetização: alfabeto, vogais, sílabas, letra inicial, troca letra e palavras.', 29.90, 'pack', null, array['alfabeto-tracado', 'vogais-tracado', 'forme-silabas', 'letra-inicial', 'troca-letra', 'qual-e-a-palavra'], true),
  ('pack-numeros-formas', 'Kit Cores, Números e Formas', 'Os 4 cadernos: cores, quantidades, operações e formas geométricas.', 19.90, 'pack', null, array['aprende-cores', 'aprende-quantidades', 'aprende-operacoes', 'mestre-das-formas'], true),
  ('pack-fe', 'Kit Fé', 'Livro de Colorir Bíblico, Meu Diário com Deus e A Páscoa de Ton.', 24.90, 'pack', null, array['livro-de-colorir-biblico', 'meu-diario-com-deus', 'a-pascoa-de-ton'], true)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  category = excluded.category,
  storage_path = excluded.storage_path,
  bundle_items = excluded.bundle_items,
  active = excluded.active;

-- Garante que todo produto vendável tem um PDF ou é um pack.
alter table public.products drop constraint if exists products_file_or_bundle;
alter table public.products add constraint products_file_or_bundle
  check (storage_path is not null or bundle_items is not null);
