-- Controle de pagamento e de e-mails enviados pelo webhook-stripe.
--
-- * paid_at: quando o pedido virou "paid" (cartão na hora; Pix quando o
--   pagamento é compensado, via checkout.session.async_payment_succeeded).
-- * confirmation_email_sent_at: e-mail com o link /sucesso enviado ao cliente.
-- * sale_notification_sent_at: aviso de venda enviado para CONTACT_EMAIL.
--
-- O webhook só marca "paid" com um update condicional (status <> 'paid'),
-- então eventos repetidos da Stripe não reprocessam o pedido nem reenviam
-- e-mails.

alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists confirmation_email_sent_at timestamptz;
alter table public.orders add column if not exists sale_notification_sent_at timestamptz;

-- Pedidos pagos antes desta migration: usa a data de criação como referência.
update public.orders set paid_at = created_at where status = 'paid' and paid_at is null;
