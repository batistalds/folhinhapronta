import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Cancelled() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <XCircle className="h-16 w-16 text-orange" />
      <h1 className="text-2xl font-extrabold text-petrol sm:text-3xl">Pagamento cancelado</h1>
      <p className="max-w-md text-petrol-600">
        A tua compra não foi concluída. O teu carrinho continua guardado, podes tentar novamente quando quiseres.
      </p>
      <Button variant="accent" size="lg" asChild>
        <Link to="/">Voltar ao carrinho</Link>
      </Button>
    </div>
  )
}
