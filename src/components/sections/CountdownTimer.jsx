import { motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'

const TWENTY_MINUTES = 20 * 60

export function CountdownTimer() {
  const { minutes, seconds } = useCountdown(TWENTY_MINUTES)

  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className="flex items-center gap-2 rounded-2xl bg-orange px-5 py-3 text-white shadow-lg shadow-orange-200/60"
      role="timer"
      aria-live="polite"
    >
      <span className="text-xs font-bold uppercase tracking-wide sm:text-sm">Termina em</span>
      <div className="flex items-center gap-1 font-mono text-2xl font-extrabold tabular-nums sm:text-3xl">
        <span className="rounded-lg bg-white/15 px-2 py-0.5">{minutes}</span>
        <span>:</span>
        <span className="rounded-lg bg-white/15 px-2 py-0.5">{seconds}</span>
      </div>
    </motion.div>
  )
}
