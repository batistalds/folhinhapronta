import { motion } from 'framer-motion'
import { Star, Download, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-petrol-50 via-surface to-surface">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mint-100 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-orange-100 blur-3xl" />

      <div className="container relative flex flex-col items-center gap-8 py-16 text-center sm:py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-petrol sm:text-5xl lg:text-6xl"
        >
          Folhinha Pronta <span className="text-mint">—</span> menos tempo preparando,
          <br className="hidden sm:block" /> mais tempo ensinando
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl text-balance text-lg font-medium text-petrol-600 sm:text-xl"
        >
          Tudo pronto. É só imprimir e ensinar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button variant="accent" size="lg" asChild>
            <a href="#promocoes">Ver ofertas limitadas</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4 text-sm font-semibold text-petrol-600"
        >
          <div className="flex items-center gap-2">
            <div className="flex text-orange">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-orange" />
              ))}
            </div>
            <span>4.9/5 (1.240 avaliações)</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-mint" />
            <span>+50.000 downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-petrol" />
            <span>+8.500 professores e pais já compraram</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
