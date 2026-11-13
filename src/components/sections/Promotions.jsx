import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CountdownTimer } from '@/components/sections/CountdownTimer'
import { PromotionCard } from '@/components/sections/PromotionCard'
import { mainPromotion, promotions } from '@/data/promotions'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export function Promotions() {
  const { addItem } = useCart()

  const handleAdd = (promo) => {
    addItem({ id: promo.id, title: promo.title, price: promo.price })
  }

  return (
    <section id="promocoes" className="py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="soft" className="mb-3">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Promoções
          </Badge>
          <h2 className="text-3xl font-extrabold text-petrol sm:text-4xl">Ofertas pensadas para economizar tempo e dinheiro</h2>
          <p className="mt-3 text-petrol-600">Packs com desconto em relação à compra avulsa de cada material.</p>
        </div>

        {/* Main promotion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 overflow-hidden rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 shadow-card-hover sm:p-10"
        >
          <div className="absolute right-6 top-6 hidden sm:block">
            <CountdownTimer />
          </div>

          <div className="mb-4 flex items-center gap-3 sm:mb-2">
            <Badge variant="orange" className="text-[11px] tracking-wide">
              {mainPromotion.badge}
            </Badge>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 text-5xl">{mainPromotion.emoji}</div>
              <h3 className="mb-2 text-2xl font-extrabold text-petrol sm:text-3xl">{mainPromotion.title}</h3>
              <p className="mb-4 text-petrol-600">{mainPromotion.description}</p>

              <div className="mb-2 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-orange-600">{formatPrice(mainPromotion.price)}</span>
                <span className="text-lg font-medium text-petrol-300 line-through">
                  {formatPrice(mainPromotion.oldPrice)}
                </span>
              </div>
              {mainPromotion.scarcity && (
                <p className="mb-6 text-xs font-semibold text-petrol-500">{mainPromotion.scarcity}</p>
              )}

              <div className="sm:hidden mb-6">
                <CountdownTimer />
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={() =>
                  addItem({ id: mainPromotion.id, title: mainPromotion.title, price: mainPromotion.price })
                }
              >
                Aproveitar oferta
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Secondary promotions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <PromotionCard promo={promo} onAdd={handleAdd} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
