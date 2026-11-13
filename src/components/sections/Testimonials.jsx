import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { testimonials } from '@/data/testimonials'

export function Testimonials() {
  if (testimonials.length === 0) return null

  return (
    <section id="depoimentos" className="py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="mint" className="mb-3">
            Depoimentos
          </Badge>
          <h2 className="text-3xl font-extrabold text-petrol sm:text-4xl">Professores e pais confiam na Folhinha Pronta</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-petrol-100 bg-white p-6 shadow-card"
            >
              <Quote className="mb-3 h-6 w-6 text-mint-200" />
              <p className="mb-5 flex-1 text-sm leading-relaxed text-petrol-700">&ldquo;{t.quote}&rdquo;</p>

              <div className="mb-2 flex text-orange">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s < t.rating ? 'fill-orange' : 'fill-transparent'}`} />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol-100 text-sm font-bold text-petrol">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-petrol">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
