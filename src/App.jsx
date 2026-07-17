import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from '@/context/ToastContext'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { Success } from '@/pages/Success'
import { Cancelled } from '@/pages/Cancelled'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sucesso" element={<Success />} />
              <Route path="/cancelado" element={<Cancelled />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </ToastProvider>
  )
}

export default App
