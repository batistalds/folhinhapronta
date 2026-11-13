// Supabase Edge Function: webhook-stripe
//
// Recebe os eventos da Stripe (assinatura validada com STRIPE_WEBHOOK_SECRET)
// e atualiza o pedido:
//
//   checkout.session.completed             → "paid" só se payment_status === 'paid'
//                                            (cartão). Com Pix o pagamento ainda
//                                            está pendente e o pedido segue "pending".
//   checkout.session.async_payment_succeeded → "paid" (Pix compensado)
//   checkout.session.async_payment_failed    → "failed"
//   checkout.session.expired                 → "failed" (se ainda estiver pendente)
//
// Idempotente: o pedido só vira "paid" com um update condicional
// (status <> 'paid'), então a Stripe pode reenviar o mesmo evento sem efeito
// duplicado.
//
// Endpoint configurado na Stripe:
//   https://<project-ref>.supabase.co/functions/v1/webhook-stripe
// Deploy: supabase functions deploy webhook-stripe --no-verify-jwt

import Stripe from 'npm:stripe@17'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

type Session = Stripe.Checkout.Session

// Marca o pedido como pago. Devolve o pedido se ESTA chamada fez a transição
// (null se já estava pago ou não existe), para efeitos colaterais rodarem uma vez.
async function markPaid(orderId: string, session: Session) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      ...(session.customer_details?.email ? { customer_email: session.customer_details.email } : {}),
    })
    .eq('id', orderId)
    .neq('status', 'paid')
    .select('id, total, customer_email, stripe_session_id')
    .maybeSingle()

  if (error) throw error
  return data
}

async function markFailed(orderId: string, onlyIfPending: boolean) {
  let query = supabaseAdmin.from('orders').update({ status: 'failed' }).eq('id', orderId)
  query = onlyIfPending ? query.eq('status', 'pending') : query.neq('status', 'paid')
  const { error } = await query
  if (error) throw error
}

// Pix: sessão concluída, pagamento ainda pendente. Guarda o e-mail do cliente.
async function markAwaitingPayment(orderId: string, session: Session) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      stripe_session_id: session.id,
      ...(session.customer_details?.email ? { customer_email: session.customer_details.email } : {}),
    })
    .eq('id', orderId)
    .eq('status', 'pending')
  if (error) throw error
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!signature) {
    return new Response('Assinatura ausente', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (error) {
    console.error('Assinatura do webhook inválida:', error)
    return new Response('Assinatura inválida', { status: 400 })
  }

  try {
    const session = event.data.object as Session
    const orderId = session.metadata?.order_id

    if (!event.type.startsWith('checkout.session.')) {
      return Response.json({ received: true, ignored: event.type })
    }

    if (!orderId) {
      console.error(`${event.type} sem order_id nos metadata (sessão ${session.id})`)
      return Response.json({ received: true })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
          await markPaid(orderId, session)
        } else {
          await markAwaitingPayment(orderId, session)
        }
        break

      case 'checkout.session.async_payment_succeeded':
        await markPaid(orderId, session)
        break

      case 'checkout.session.async_payment_failed':
        await markFailed(orderId, false)
        break

      case 'checkout.session.expired':
        await markFailed(orderId, true)
        break
    }

    return Response.json({ received: true })
  } catch (error) {
    // 500 faz a Stripe reenviar o evento mais tarde.
    console.error('webhook-stripe error:', error)
    return new Response('Erro interno', { status: 500 })
  }
})
