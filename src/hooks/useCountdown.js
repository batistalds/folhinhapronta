import { useEffect, useState } from 'react'

export function useCountdown(durationSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? durationSeconds : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [durationSeconds])

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  return { minutes, seconds, secondsLeft }
}
