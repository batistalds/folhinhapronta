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
// Quando o pedido vira "paid", envia (em segundo plano, sem afetar a resposta):
//   * ao cliente: e-mail com o link da página /sucesso da compra;
//   * para CONTACT_EMAIL (secret, nunca exposto no site): aviso de nova venda.
// Falha no envio só é registrada no log — o pedido continua "paid".
//
// Endpoint configurado na Stripe:
//   https://<project-ref>.supabase.co/functions/v1/webhook-stripe
// Deploy: supabase functions deploy webhook-stripe --no-verify-jwt

import Stripe from 'npm:stripe@17'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { escapeHtml, formatBRL, sendEmail } from '../_shared/email.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  // Versão fixada de propósito: nas versões novas a Stripe não aceita mais
  // payment_method_types no Checkout (usado para oferecer cartão + Pix).
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://folhinhapronta.pages.dev').replace(/\/+$/, '')
const CONTACT_EMAIL = Deno.env.get('CONTACT_EMAIL') ?? ''

type Session = Stripe.Checkout.Session
type PaidOrder = { id: string; total: number; customer_email: string | null; stripe_session_id: string | null }

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void } | undefined

async function notifyPaid(order: PaidOrder, session: Session, method: string) {
  try {
    const { data: rows } = await supabaseAdmin
      .from('order_items')
      .select('products (title)')
      .eq('order_id', order.id)
    const titles = (rows ?? []).map((r) => (r.products as unknown as { title: string })?.title).filter(Boolean)
    const total = formatBRL(Number(order.total))
    const link = `${SITE_URL}/sucesso?session_id=${order.stripe_session_id ?? session.id}`

    if (order.customer_email) {
      const itemsHtml = titles.map((t) => `<li>${escapeHtml(t)}</li>`).join('')
      const sent = await sendEmail({
        to: order.customer_email,
        subject: 'Seus materiais da Folhinha Pronta estão prontos',
        text: [
          'Obrigado pela sua compra na Folhinha Pronta!',
          '',
          'Itens:',
          ...titles.map((t) => `- ${t}`),
          `Total: ${total}`,
          '',
          `Baixe seus PDFs por este link: ${link}`,
          '',
          'Cada download fica disponível por 30 minutos; se expirar, é só abrir o link de novo.',
          'Guarde este e-mail. Dúvidas? Responda esta mensagem.',
        ].join('\n'),
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1E3A5F">
            <h2 style="margin-bottom:4px">Obrigado pela sua compra! 🎉</h2>
            <p>Seu pagamento foi confirmado. Estes são os seus materiais:</p>
            <ul>${itemsHtml}</ul>
            <p><strong>Total:</strong> ${total}</p>
            <p style="margin:28px 0">
              <a href="${link}" style="background:#F97316;color:#fff;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold">
                Baixar meus PDFs
              </a>
            </p>
            <p style="font-size:13px;color:#555">
              Cada link de download fica disponível por 30 minutos; se expirar, é só abrir o botão acima de novo.
              Guarde este e-mail. Dúvidas? É só responder esta mensagem.
            </p>
            <p style="font-size:13px;color:#555">Folhinha Pronta</p>
          </div>`,
      })
      if (sent) {
        await supabaseAdmin.from('orders').update({ confirmation_email_sent_at: new Date().toISOString() }).eq('id', order.id)
      }
    } else {
      console.warn(`Pedido ${order.id} pago sem e-mail do cliente: confirmação não enviada.`)
    }

    if (CONTACT_EMAIL) {
      const sent = await sendEmail({
        to: CONTACT_EMAIL,
        subject: `Nova venda: ${total} (${method})`,
        text: [
          `Nova venda confirmada: ${total}`,
          `Cliente: ${order.customer_email ?? '(sem e-mail)'}`,
          'Itens:',
          ...titles.map((t) => `- ${t}`),
          `Pedido: ${order.id}`,
          `Sessão Stripe: ${order.stripe_session_id ?? session.id}`,
        ].join('\n'),
        html: `
          <div style="font-family:Arial,sans-serif;color:#1E3A5F">
            <h3>Nova venda confirmada: ${total}</h3>
            <p><strong>Cliente:</strong> ${escapeHtml(order.customer_email ?? '(sem e-mail)')}</p>
            <ul>${titles.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
            <p style="font-size:12px;color:#555">Pedido ${order.id} · Sessão ${escapeHtml(order.stripe_session_id ?? session.id)}</p>
          </div>`,
      })
      if (sent) {
        await supabaseAdmin.from('orders').update({ sale_notification_sent_at: new Date().toISOString() }).eq('id', order.id)
      }
    }
  } catch (error) {
    console.error(`Erro ao enviar e-mails do pedido ${order.id}:`, error)
  }
}

// Envia os e-mails sem segurar a resposta para a Stripe.
function notifyInBackground(order: PaidOrder | null, session: Session, method: string) {
  if (!order) return
  const task = notifyPaid(order, session, method)
  if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(task)
}

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
          notifyInBackground(await markPaid(orderId, session), session, 'cartão')
        } else {
          await markAwaitingPayment(orderId, session)
        }
        break

      case 'checkout.session.async_payment_succeeded':
        notifyInBackground(await markPaid(orderId, session), session, 'Pix')
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
