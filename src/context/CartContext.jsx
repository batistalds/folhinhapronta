import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/context/ToastContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'folhinhapronta_cart'

function readInitialCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart)
  const { showToast } = useToast()

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...item, qty: 1 }]
    })
    showToast(`${item.title} adicionado ao carrinho`)
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setItems([])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items])

  const value = { items, addItem, removeItem, clearCart, count, total }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
