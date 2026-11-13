import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { PackCovers } from '@/components/sections/PackCovers'

const accentStyles = {
  petrol: 'border-petrol-200 bg-petrol-50',
  mint: 'border-mint-200 bg-mint-50',
  orange: 'border-orange-200 bg-orange-50',
}

const badgeVariants = {
  petrol: 'default',
  mint: 'mint',
  orange: 'orange',
}

export function PromotionCard({ promo, onAdd }) {
  const accent = promo.accent || 'orange'

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex h-full flex-col rounded-2xl border-2 p-6 shadow-card transition-shadow hover:shadow-card-hover ${accentStyles[accent]}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <PackCovers items={promo.items} max={4} />
        <Badge variant={badgeVariants[accent]}>{promo.badge}</Badge>
      </div>

      <h3 className="mb-2 text-lg font-bold text-petrol">{promo.title}</h3>
      <p className="mb-4 flex-1 text-sm text-petrol-600">{promo.description}</p>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-petrol">{formatPrice(promo.price)}</span>
        {promo.oldPrice && (
          <span className="text-sm font-medium text-petrol-300 line-through">{formatPrice(promo.oldPrice)}</span>
        )}
      </div>

      <Button variant="accent" className="w-full" onClick={() => onAdd(promo)}>
        Adicionar ao carrinho
      </Button>
    </motion.div>
  )
}
