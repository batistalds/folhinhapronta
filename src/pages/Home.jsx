import { useEffect, useState } from 'react'
import { Hero } from '@/components/sections/Hero'
import { Promotions } from '@/components/sections/Promotions'
import { Products } from '@/components/sections/Products'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'

export function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <Hero />
      <Promotions />
      <Products loading={loading} />
      <Testimonials />
      <FAQ />
    </>
  )
}
