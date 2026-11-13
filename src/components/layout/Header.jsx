import { useState } from 'react'
import { BookOpenCheck, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { formatPrice } from '@/lib/utils'

export function Header() {
  const [cartOpen, setCartOpen] = useState(false)
  const { count, total } = useCart()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-petrol-100/60 bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between sm:h-20">
          <a href="#top" className="flex min-h-11 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-petrol text-mint sm:h-10 sm:w-10">
              <BookOpenCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-petrol sm:text-2xl">
              Folhinha <span className="text-mint">Pronta</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-petrol-600 md:flex">
            <a href="#promocoes" className="transition-colors hover:text-orange">
              Promoções
            </a>
            <a href="#materiais" className="transition-colors hover:text-orange">
              Materiais
            </a>
            <a href="#depoimentos" className="transition-colors hover:text-orange">
              Depoimentos
            </a>
            <a href="#faq" className="transition-colors hover:text-orange">
              FAQ
            </a>
          </nav>

          <button
            onClick={() => setCartOpen(true)}
            className="group relative flex min-h-11 items-center gap-2 rounded-full border border-petrol-100 bg-surface px-3.5 py-2 transition-colors hover:border-petrol hover:bg-petrol-50 sm:px-4"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-5 w-5 text-petrol transition-transform group-hover:scale-110" />
            <span className="hidden text-sm font-bold text-petrol sm:inline">{formatPrice(total)}</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[11px] font-bold text-white shadow-sm"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
