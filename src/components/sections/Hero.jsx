import { motion } from 'framer-motion'
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
            <a href="#promocoes">Ver promoções</a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
