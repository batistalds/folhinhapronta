// Supabase Edge Function: webhook-stripe
//
// Escuta eventos da Stripe. Valida a assinatura do webhook com
// STRIPE_WEBHOOK_SECRET e, ao receber `checkout.session.completed`,
// marca a encomenda correspondente como "paid".
//
// Configurar no painel da Stripe o endpoint:
//   https://<project-ref>.supabase.co/functions/v1/webhook-stripe

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

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!signature) {
    return new Response('Assinatura em falta', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (error) {
    console.error('Assinatura do webhook inválida:', error)
    return new Response('Assinatura inválida', { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            stripe_session_id: session.id,
            customer_email: session.customer_details?.email ?? undefined,
          })
          .eq('id', orderId)

        if (error) throw error
      } else {
        console.error('checkout.session.completed sem order_id nos metadata')
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id
      if (orderId) {
        await supabaseAdmin.from('orders').update({ status: 'failed' }).eq('id', orderId)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('webhook-stripe error:', error)
    return new Response('Erro interno', { status: 500 })
  }
})
