import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Download, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useCart } from '@/context/CartContext'

const POLL_INTERVAL_MS = 3000
const MAX_POLLS = 6 // ~18s à espera do webhook confirmar o pagamento

export function Success() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  const [state, setState] = useState({ loading: true, status: null, items: [], error: null })
  const pollCount = useRef(0)
  const clearedRef = useRef(false)

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, status: null, items: [], error: 'Sessão de pagamento não encontrada.' })
      return
    }

    let cancelled = false
    let timeoutId

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-order-status', {
          body: { sessionId },
        })

        if (cancelled) return
        if (error) throw error

        if (data.status === 'paid') {
          setState({ loading: false, status: 'paid', items: data.items ?? [], error: null })
          if (!clearedRef.current) {
            clearedRef.current = true
            clearCart()
          }
          return
        }

        if (data.status === 'failed' || data.status === 'not_found') {
          setState({ loading: false, status: data.status, items: [], error: null })
          return
        }

        // ainda "pending" — o webhook pode demorar alguns segundos
        pollCount.current += 1
        if (pollCount.current >= MAX_POLLS) {
          setState({ loading: false, status: 'pending', items: [], error: null })
          return
        }

        timeoutId = setTimeout(fetchStatus, POLL_INTERVAL_MS)
      } catch (err) {
        if (cancelled) return
        console.error('Erro ao consultar encomenda:', err)
        setState({ loading: false, status: null, items: [], error: 'Não foi possível confirmar a sua compra.' })
      }
    }

    fetchStatus()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [sessionId, clearCart])

  if (state.loading) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-petrol" />
        <p className="text-petrol-600">Confirmando seu pagamento...</p>
      </div>
    )
  }

  if (state.status === 'paid') {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-mint" />
        <div>
          <h1 className="text-2xl font-extrabold text-petrol sm:text-3xl">Compra confirmada!</h1>
          <p className="mt-2 max-w-md text-petrol-600">
            Obrigado pela sua compra. Seus materiais estão prontos — os links expiram em 30 minutos.
          </p>
        </div>

        <ul className="flex w-full max-w-md flex-col gap-3">
          {state.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-white p-4 shadow-card"
            >
              <span className="text-left text-sm font-semibold text-petrol">{item.title}</span>
              {item.downloadUrl ? (
                <Button asChild variant="mint" size="sm">
                  <a href={item.downloadUrl} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    Baixar
                  </a>
                </Button>
              ) : (
                <span className="text-xs font-medium text-red-500">Link indisponível</span>
              )}
            </li>
          ))}
        </ul>

        <Button variant="outline" asChild>
          <Link to="/">Voltar à página inicial</Link>
        </Button>
      </div>
    )
  }

  if (state.status === 'pending') {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <Loader2 className="h-16 w-16 text-orange" />
        <h1 className="text-2xl font-extrabold text-petrol sm:text-3xl">Ainda estamos confirmando o pagamento</h1>
        <p className="max-w-md text-petrol-600">
          Isso pode levar mais alguns segundos. Atualize a página daqui a pouco — você não será cobrado duas vezes.
        </p>
        <Button variant="accent" size="lg" onClick={() => window.location.reload()}>
          Atualizar
        </Button>
      </div>
    )
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertTriangle className="h-16 w-16 text-orange" />
      <h1 className="text-2xl font-extrabold text-petrol sm:text-3xl">Não foi possível confirmar a compra</h1>
      <p className="max-w-md text-petrol-600">{state.error ?? 'Verifique seu e-mail ou entre em contato conosco para ajudar.'}</p>
      <Button variant="accent" size="lg" asChild>
        <Link to="/">Voltar à página inicial</Link>
      </Button>
    </div>
  )
}
