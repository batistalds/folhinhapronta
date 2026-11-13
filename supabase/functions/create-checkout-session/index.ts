// Supabase Edge Function: create-checkout-session
//
// Recebe os itens do carrinho do frontend, valida-os e recalcula os preços
// a partir da tabela `products` (nunca confia em preços vindos do browser),
// cria a encomenda (status "pending") + itens, abre uma Stripe Checkout
// Session em modo pagamento único e devolve o URL de checkout.

import Stripe from 'npm:stripe@17'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCorsPreflight, jsonResponse } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  // Versão fixada de propósito: nas versões novas a Stripe não aceita mais
  // payment_method_types no Checkout (usado para oferecer cartão + Pix).
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

Deno.serve(async (req) => {
  const preflight = handleCorsPreflight(req)
  if (preflight) return preflight

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  try {
    const { items, customerEmail } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ error: 'O carrinho está vazio' }, 400)
    }

    // Produtos digitais: cada produto entra uma única vez, sempre com quantidade 1.
    // IDs repetidos e qualquer "qty" enviada pelo browser são ignorados.
    const ids = [...new Set(items.map((item: { id: string }) => String(item?.id ?? '')))].filter(Boolean)

    if (ids.length === 0 || ids.length > 50) {
      return jsonResponse({ error: 'Carrinho inválido' }, 400)
    }

    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, title, price')
      .in('id', ids)
      .eq('active', true)

    if (productsError) throw productsError

    const productMap = new Map(products.map((p) => [p.id, p]))

    const invalid = ids.filter((id) => !productMap.has(id))
    if (invalid.length > 0) {
      return jsonResponse({ error: `Produto indisponível: ${invalid.join(', ')}` }, 400)
    }

    const lineItems = ids.map((id) => ({ product: productMap.get(id)!, qty: 1 }))

    const total = lineItems.reduce((sum, li) => sum + Number(li.product.price), 0)

    // 1. Criar a encomenda (pending)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({ customer_email: customerEmail ?? null, total, status: 'pending' })
      .select()
      .single()

    if (orderError) throw orderError

    // 2. Criar os itens da encomenda
    const orderItemsPayload = lineItems.map((li) => ({
      order_id: order.id,
      product_id: li.product.id,
      price: li.product.price,
    }))

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsPayload)
    if (itemsError) throw itemsError

    // 3. Criar a Stripe Checkout Session (cartão + Pix)
    const baseParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: lineItems.map((li) => ({
        quantity: 1,
        price_data: {
          currency: 'brl',
          unit_amount: Math.round(Number(li.product.price) * 100),
          product_data: { name: li.product.title },
        },
      })),
      metadata: { order_id: order.id },
      success_url: `${SITE_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cancelado`,
    }

    let session: Stripe.Checkout.Session
    try {
      // Pix precisa estar ativado na Stripe (Settings → Payment methods).
      // É assíncrono: o pedido só vira "paid" no evento async_payment_succeeded.
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        payment_method_types: ['card', 'pix'],
        payment_method_options: {
          pix: { expires_after_seconds: 60 * 60 }, // QR code válido por 1 hora
        },
      })
    } catch (error) {
      // Se o Pix não estiver disponível na conta, não bloqueia a venda: segue só com cartão.
      if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) throw error
      console.warn('Pix indisponível, criando sessão só com cartão:', error.message)
      session = await stripe.checkout.sessions.create({ ...baseParams, payment_method_types: ['card'] })
    }

    // 4. Guardar o id da sessão Stripe na encomenda
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    if (updateError) throw updateError

    return jsonResponse({ checkoutUrl: session.url })
  } catch (error) {
    console.error('create-checkout-session error:', error)
    return jsonResponse({ error: error instanceof Error ? error.message : 'Erro inesperado' }, 500)
  }
})
