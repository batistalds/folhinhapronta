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
  apiVersion: '2024-06-20',
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

    const ids = items.map((item: { id: string }) => item.id)

    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, title, price')
      .in('id', ids)
      .eq('active', true)

    if (productsError) throw productsError

    const productMap = new Map(products.map((p) => [p.id, p]))

    const lineItems = items.map((item: { id: string; qty: number }) => {
      const product = productMap.get(item.id)
      if (!product) {
        throw new Error(`Produto inválido no carrinho: ${item.id}`)
      }
      const qty = Math.max(1, Math.floor(item.qty ?? 1))
      return { product, qty }
    })

    const total = lineItems.reduce((sum, li) => sum + li.product.price * li.qty, 0)

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

    // 3. Criar a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: lineItems.map((li) => ({
        quantity: li.qty,
        price_data: {
          currency: 'brl',
          unit_amount: Math.round(li.product.price * 100),
          product_data: { name: li.product.title },
        },
      })),
      metadata: { order_id: order.id },
      success_url: `${SITE_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cancelado`,
    })

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
