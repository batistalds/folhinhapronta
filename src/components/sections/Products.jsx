import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '@/components/sections/ProductCard'
import { categories, products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export function Products({ loading }) {
  const [activeCategory, setActiveCategory] = useState('todos')
  const { addItem } = useCart()

  const filtered = useMemo(
    () => (activeCategory === 'todos' ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory]
  )

  return (
    <section id="materiais" className="bg-petrol-50/40 py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">
            <FileText className="mr-1 h-3.5 w-3.5" />
            Materiais individuais
          </Badge>
          <h2 className="text-3xl font-extrabold text-petrol sm:text-4xl">Escolha exatamente o que você precisa</h2>
          <p className="mt-3 text-petrol-600">Atividades, resumos e planos prontos para imprimir por {' '}
            <span className="font-bold text-petrol">{formatPrice(27.9)}</span> cada.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'border-petrol bg-petrol text-white shadow-md'
                  : 'border-petrol-100 bg-white text-petrol-600 hover:border-petrol-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-petrol-100 bg-white shadow-card">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))
            : filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                >
                  <ProductCard product={product} onAdd={addItem} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
