# Pendências — Folhinha Pronta

Última atualização: 14/11/2026

- **Marca:** Folhinha Pronta (antes "Aprendemais")
- **Site:** https://folhinhapronta.pages.dev (Cloudflare Pages, deploy automático na `master`)
- **Repositório:** https://github.com/batistalds/folhinhapronta
- **Supabase:** projeto `btahtlpgbdagziqbyvfx`
- **E-mail público da loja:** folhinhapronta@gmail.com (rodapé, Termos, FAQ, remetente e reply-to).
  O e-mail pessoal fica só no secret `CONTACT_EMAIL` (aviso de venda) e nunca aparece ao cliente.
- **Não usar:** o domínio aprendemais.com.br (não é nosso) e a Vercel (desativada).

## Feito

- [x] Catálogo real: 23 produtos + 4 kits fixos (migration 0004), 23 PDFs no bucket `pdfs`
- [x] Nova marca em todo o projeto; migration 0005 renomeia o "Combo Completo Folhinha Pronta" no banco
- [x] Config da Vercel removida; `public/_redirects` para o Cloudflare Pages
- [x] Removidos números inventados do Hero (avaliações, downloads, compradores)
- [x] Depoimentos fictícios removidos; seção some enquanto `src/data/testimonials.js` estiver vazio
- [x] Cronômetro que reiniciava removido; agora só aparece com data real em `PROMO_END_AT` e some ao terminar
- [x] Quantidade fixa em 1 por produto (carrinho e checkout)
- [x] Pix no checkout (com volta automática para só cartão se o Pix não estiver disponível)
- [x] Webhook idempotente: cartão, Pix compensado, Pix falho e sessão expirada
- [x] E-mail ao cliente com o link da /sucesso e a lista de materiais (inclusive PDFs dos kits) e aviso de venda para `CONTACT_EMAIL` — via API do Brevo
- [x] Páginas /termos e /privacidade (MODELO), rodapé com contato e links legais, sem ícones de redes
- [x] Direito de arrependimento de 7 dias (CDC art. 49) no lugar de "sem reembolso"
- [x] Migration 0006 aplicada e funções publicadas (Pix ativo no checkout de teste, webhook validado)
- [x] Imagens dos produtos geradas dos próprios PDFs (`public/products/`, 4:3); oferta e kits com emoji
- [x] Layout para celular: 2 produtos por linha, categorias roláveis, carrinho com nome completo
- [x] Aviso de spam na /sucesso e na FAQ
- [x] Link desligado na Stripe (teste); checkout mostra Cartão e Pix
- [x] FAQ alinhada com o funcionamento real; textos pt-PT → pt-BR; README atualizado

## Depende de você

### Para colocar as mudanças de pagamento no ar
- [ ] Stripe → Dados públicos: nome **Folhinha Pronta** e extrato `FOLHINHA PRONTA` (hoje aparece "Área restrita de Site49").
- [ ] Modo produção: ativar a conta, Pix ligado, Link desligado (repetir o que foi feito no teste).
- [ ] Webhook de teste já tem os 4 eventos. Ao criar o webhook de **produção**, incluir:
      `checkout.session.completed`, `checkout.session.expired`,
      `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.

### E-mail (Brevo)
- [x] Brevo configurado (sender folhinhapronta@gmail.com, secrets e webhook publicados); testado com cartão e Pix: confirmação chega ao comprador e aviso de venda ao e-mail pessoal.
- [ ] Opcional (melhora a entrega e reduz spam): domínio próprio autenticado no Brevo e `SITE_URL` apontando para ele.

### Conteúdo e jurídico
- [ ] Confirmar o direito de revenda dos materiais com logo "ABC Fácil" (6 de alfabetização) e dos livros de colorir com texto em inglês.
- [ ] Revisar Termos, Privacidade e o texto de arrependimento com contador/advogado.
- [ ] Informar nome/razão social e CNPJ quando houver (preencher `legalName` e `document`
      em `src/data/site.js`).
- [ ] Depoimentos reais (com autorização) → `src/data/testimonials.js`.
- [ ] Redes sociais: quando existirem, adicionar os links no rodapé.
- [ ] Promoção com data de fim real (opcional) → `PROMO_END_AT` em `src/data/promotions.js`.

### Antes de vender de verdade
- [ ] Fazer o roteiro de teste completo em https://folhinhapronta.pages.dev.
- [ ] Trocar as chaves da Stripe de teste para produção (secrets `STRIPE_SECRET_KEY` e
      `STRIPE_WEBHOOK_SECRET`). A chave de teste `rk_test_...` foi colada no chat: gerar uma nova.
- [ ] Depois do teste: apagar o projeto "aprendemais" na Vercel.

## Como consultar pedidos (sem painel admin)

Supabase → Table Editor → `orders` (status, total, e-mail, `paid_at`, e-mails enviados)
e `order_items` (produtos de cada pedido). Ou no SQL Editor:

```sql
select o.created_at, o.status, o.total, o.customer_email, o.paid_at,
       string_agg(oi.product_id, ', ') as itens
from orders o join order_items oi on oi.order_id = o.id
group by o.id order by o.created_at desc;
```
