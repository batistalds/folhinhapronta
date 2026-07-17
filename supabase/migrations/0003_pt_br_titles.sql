-- Sincroniza os títulos/descrições de products com o português brasileiro
-- usado agora no frontend (src/data/products.js, src/data/promotions.js).
-- O título é o que aparece como nome do item na Stripe Checkout Session,
-- por isso tem de continuar igual ao que o cliente vê no carrinho.

update public.products set title = 'Atividades de Frações — 4º ano'
  where id = 'mat-4ano-fracoes';

update public.products set title = 'Atividades de Números e Operações'
  where id = 'mat-5-6-numeros';

update public.products set description = '45 páginas · Anos finais do Fundamental'
  where id = 'port-interpretacao-textos';

update public.products set title = 'O Corpo Humano — Atividade Completa'
  where id = 'ciencias-corpo-humano';

update public.products set description = '20 páginas · Anos iniciais'
  where id = 'ingles-vocabulario-basico';

update public.products set description = '26 páginas · Anos finais'
  where id = 'ingles-verbos-presente';

update public.products set
  title = 'Compre 5 materiais e ganhe 3 grátis'
  where id = 'promo-5-mais-3';

update public.products set
  title = 'Pack Volta às Aulas',
  description = '10 materiais essenciais para começar o ano'
  where id = 'promo-regresso-aulas';

update public.products set
  title = 'Compre 3, leve 1 grátis'
  where id = 'promo-3-mais-1';

update public.products set
  description = '20 materiais, todas as matérias'
  where id = 'promo-completo-ano';
