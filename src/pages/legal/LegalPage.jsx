import { AlertTriangle } from 'lucide-react'

export function LegalPage({ title, updatedAt, children }) {
  return (
    <div className="container max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex items-start gap-3 rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p>MODELO — revisar com contador/advogado antes de considerar este texto definitivo.</p>
      </div>

      <h1 className="text-3xl font-extrabold text-petrol sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-petrol-500">Última atualização: {updatedAt}</p>

      <div className="legal-content mt-8 space-y-6 text-petrol-700 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-petrol [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  )
}
