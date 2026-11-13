import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Ao trocar de página, volta ao topo (ou rola até a âncora, ex.: /#faq).
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
