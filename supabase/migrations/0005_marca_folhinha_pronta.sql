-- Nova marca: Aprendemais → Folhinha Pronta.
-- O título do pack aparece no checkout da Stripe e no e-mail de confirmação.

update public.products
   set title = 'Combo Completo Folhinha Pronta'
 where id = 'pack-completo';
