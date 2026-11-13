import { Link } from 'react-router-dom'
import { BookOpenCheck, Mail, MessageCircle } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { site } from '@/data/site'

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
            Atividades infantis em PDF prontas para imprimir. Menos tempo preparando, mais tempo ensinando.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Links rápidos</h4>
          <ul className="text-sm text-petrol-200">
            <li><a href="/#promocoes" className="inline-block py-2.5 hover:text-white">Promoções</a></li>
            <li><a href="/#materiais" className="inline-block py-2.5 hover:text-white">Materiais</a></li>
            {testimonials.length > 0 && (
              <li><a href="/#depoimentos" className="inline-block py-2.5 hover:text-white">Depoimentos</a></li>
            )}
            <li><a href="/#faq" className="inline-block py-2.5 hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Contato</h4>
          <ul className="text-sm text-petrol-200">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 py-2.5 hover:text-white">
                <Mail className="h-4 w-4" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 py-2.5 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp {site.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-mint">Informações</h4>
          <ul className="text-sm text-petrol-200">
            <li><Link to="/termos" className="inline-block py-2.5 hover:text-white">Termos de Uso</Link></li>
            <li><Link to="/privacidade" className="inline-block py-2.5 hover:text-white">Política de Privacidade</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container text-center text-xs text-petrol-300">
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          {site.legalName && ` ${site.legalName}.`}
          {site.document && ` CNPJ ${site.document}.`} Materiais digitais — sem reembolso após download.
        </p>
      </div>
    </footer>
  )
}
