import { useState } from 'react'
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'

export function CartDrawer({ open, onOpenChange }) {
  const { items, removeItem, total } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: { items: items.map((i) => ({ id: i.id })) },
      })

      if (fnError) throw fnError
      if (!data?.checkoutUrl) throw new Error('Não foi possível obter o link de pagamento.')

      window.location.href = data.checkoutUrl
    } catch (err) {
      console.error('Erro ao iniciar checkout:', err)
      setError('Não foi possível iniciar o pagamento. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange" />
            O meu carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 text-petrol-100" />
              <p className="text-sm">O seu carrinho está vazio.</p>
              <p className="text-xs">Explora as promoções e materiais disponíveis.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-surface p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-petrol">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-sm font-bold text-petrol">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-petrol-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remover ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-petrol-100 px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
            <span className="text-xl font-extrabold text-petrol">{formatPrice(total)}</span>
          </div>
          {error && <p className="mb-3 text-sm font-medium text-red-500">{error}</p>}
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            disabled={items.length === 0 || loading}
            onClick={handleCheckout}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Finalizar compra'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
