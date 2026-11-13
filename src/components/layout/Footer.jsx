import { BookOpenCheck, Camera, MessageCircle, Mail } from 'lucide-react'
import { testimonials } from '@/data/testimonials'

export function Footer() {
  return (
    <footer className="bg-petrol text-petrol-50">
      <div className="container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-mint">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold text-white">
              Folhinha <span className="text-mint">Pronta</span>
            </span>
          </div>
          <p className="text-sm text-petrol-200">
            Materiais escolares em PDF prontos para imprimir. Menos tempo preparando, mais tempo ensinando.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Links rápidos</h4>
          <ul className="text-sm text-petrol-200">
            <li><a href="#promocoes" className="inline-block py-2.5 hover:text-white">Promoções</a></li>
            <li><a href="#materiais" className="inline-block py-2.5 hover:text-white">Materiais</a></li>
            {testimonials.length > 0 && (
              <li><a href="#depoimentos" className="inline-block py-2.5 hover:text-white">Depoimentos</a></li>
            )}
            <li><a href="#faq" className="inline-block py-2.5 hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Contato</h4>
          <ul className="space-y-2 text-sm text-petrol-200">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:contato@folhinhapronta.com.br" className="hover:text-white">contato@folhinhapronta.com.br</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Redes sociais</h4>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-mint hover:text-petrol"
            >
              <Camera className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-mint hover:text-petrol"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container text-center text-xs text-petrol-300">
          © {new Date().getFullYear()} Folhinha Pronta. Todos os direitos reservados. Materiais digitais — sem reembolso após download.
        </p>
      </div>
    </footer>
  )
}
