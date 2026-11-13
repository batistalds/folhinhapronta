import { useEffect, useState } from 'react'

// Contagem regressiva até uma data real (string ISO ou null).
// Não reinicia: quando a data passa, `expired` fica true.
function remaining(endAt) {
  if (!endAt) return 0
  return Math.max(0, Math.floor((new Date(endAt).getTime() - Date.now()) / 1000))
}

export function useCountdown(endAt) {
  const [secondsLeft, setSecondsLeft] = useState(() => remaining(endAt))

  useEffect(() => {
    setSecondsLeft(remaining(endAt))
    if (remaining(endAt) === 0) return
    const interval = setInterval(() => {
      const left = remaining(endAt)
      setSecondsLeft(left)
      if (left === 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [endAt])

  const pad = (n) => String(n).padStart(2, '0')

  return {
    expired: secondsLeft === 0,
    days: Math.floor(secondsLeft / 86400),
    hours: pad(Math.floor((secondsLeft % 86400) / 3600)),
    minutes: pad(Math.floor((secondsLeft % 3600) / 60)),
    seconds: pad(secondsLeft % 60),
  }
}
