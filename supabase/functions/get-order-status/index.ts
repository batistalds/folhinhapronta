// Supabase Edge Function: get-order-status
//
// A tabela `orders` não tem políticas RLS públicas (não há sistema de
// contas nesta loja), por isso a página /sucesso não consulta a tabela
// diretamente com a anon key — pede a esta função, que usa a service role,
// confirma que a encomenda está "paid" e devolve links de download
// assinados (válidos 30 minutos) para cada PDF comprado.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { handleCorsPreflight, jsonResponse } from '../_shared/cors.ts'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const SIGNED_URL_EXPIRES_IN = 60 * 30 // 30 minutos

Deno.serve(async (req) => {
  const preflight = handleCorsPreflight(req)
  if (preflight) return preflight

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  try {
    const { sessionId } = await req.json()

    if (!sessionId) {
      return jsonResponse({ error: 'sessionId em falta' }, 400)
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status, total, created_at')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (orderError) throw orderError

    if (!order) {
      return jsonResponse({ status: 'not_found' }, 404)
    }

    if (order.status !== 'paid') {
      return jsonResponse({ status: order.status })
    }

    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('price, products (id, title, storage_path)')
      .eq('order_id', order.id)

    if (itemsError) throw itemsError

    const items = await Promise.all(
      (orderItems ?? []).map(async (item) => {
        const product = item.products as unknown as { id: string; title: string; storage_path: string }
        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from('pdfs')
          .createSignedUrl(product.storage_path, SIGNED_URL_EXPIRES_IN)

        if (signError) {
          console.error(`Erro ao assinar ${product.storage_path}:`, signError)
          return { id: product.id, title: product.title, downloadUrl: null }
        }

        return { id: product.id, title: product.title, downloadUrl: signed.signedUrl }
      })
    )

    return jsonResponse({ status: 'paid', total: order.total, items })
  } catch (error) {
    console.error('get-order-status error:', error)
    return jsonResponse({ error: error instanceof Error ? error.message : 'Erro inesperado' }, 500)
  }
})
