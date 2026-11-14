import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, BookOpen, Calendar, Pencil, Puzzle, FileText, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

const icons = {
  calculator: Calculator,
  'book-open': BookOpen,
  calendar: Calendar,
  pencil: Pencil,
  puzzle: Puzzle,
}

export function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)
  const Icon = icons[product.icon] || FileText

  const handleClick = () => {
    onAdd(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-petrol-100 bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-petrol-50 to-petrol-100">
        {product.image ? (
          // Capa do PDF (página 1), gerada a partir do arquivo vendido.
          <img
            src={product.image}
            alt={`Capa de ${product.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-1.5 drop-shadow-md sm:p-3"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Icon className="h-8 w-8 text-petrol" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug text-petrol sm:text-base">{product.title}</h3>
        <p className="mb-3 line-clamp-2 text-[11px] text-muted-foreground sm:mb-4 sm:text-xs">{product.description}</p>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="text-lg font-extrabold text-petrol sm:text-xl">{formatPrice(product.price)}</span>
          <Button variant="mint" size="sm" onClick={handleClick} className="h-11 w-full min-w-[42px] sm:w-auto">
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Adicionado
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
