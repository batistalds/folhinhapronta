import { useCountdown } from '@/hooks/useCountdown'

// Mostra quanto falta até a data real de fim da promoção (PROMO_END_AT em
// src/data/promotions.js). Sem data configurada, ou depois que ela passa,
// não mostra nada.
export function CountdownTimer({ endAt }) {
  const { expired, days, hours, minutes, seconds } = useCountdown(endAt)

  if (!endAt || expired) return null

  const endLabel = new Date(endAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <div
      className="flex flex-col items-start gap-1 rounded-2xl bg-orange px-5 py-3 text-white shadow-lg shadow-orange-200/60"
      role="timer"
    >
      <span className="text-xs font-bold uppercase tracking-wide">Promoção válida até {endLabel}</span>
      <div className="flex items-center gap-1 font-mono text-xl font-extrabold tabular-nums sm:text-2xl">
        {days > 0 && <span className="rounded-lg bg-white/15 px-2 py-0.5">{days}d</span>}
        <span className="rounded-lg bg-white/15 px-2 py-0.5">{hours}</span>
        <span>:</span>
        <span className="rounded-lg bg-white/15 px-2 py-0.5">{minutes}</span>
        <span>:</span>
        <span className="rounded-lg bg-white/15 px-2 py-0.5">{seconds}</span>
      </div>
    </div>
  )
}
