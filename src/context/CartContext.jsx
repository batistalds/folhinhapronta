import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/context/ToastContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'folhinhapronta_cart'

// Produtos digitais: cada item entra no carrinho uma única vez (quantidade 1).
function readInitialCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const seen = new Set()
    return parsed
      .filter((i) => i?.id && !seen.has(i.id) && seen.add(i.id))
      .map(({ id, title, price }) => ({ id, title, price }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart)
  const { showToast } = useToast()

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // armazenamento indisponível (ex.: aba anônima): o carrinho segue só em memória
    }
  }, [items])

  const addItem = useCallback(
    (item) => {
      if (items.some((i) => i.id === item.id)) {
        showToast(`${item.title} já está no carrinho`)
        return
      }
      setItems((prev) =>
        prev.some((i) => i.id === item.id)
          ? prev
          : [...prev, { id: item.id, title: item.title, price: item.price }]
      )
      showToast(`${item.title} adicionado ao carrinho`)
    },
    [items, showToast]
  )

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  // Estável entre renders: Success.jsx usa clearCart como dependência do useEffect.
  const clearCart = useCallback(() => setItems([]), [])

  const count = items.length
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, count, total }),
    [items, addItem, removeItem, clearCart, count, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
