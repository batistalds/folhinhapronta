import { products } from '@/data/products'

const byId = new Map(products.map((p) => [p.id, p]))

// Capas sobrepostas dos PDFs que um kit entrega (+N quando há mais).
export function PackCovers({ items = [], max = 4, size = 'h-20' }) {
  const covers = items.map((id) => byId.get(id)).filter((p) => p?.image)
  if (covers.length === 0) return null
  const shown = covers.slice(0, max)
  const rest = covers.length - shown.length

  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <img
          key={p.id}
          src={p.image}
          alt={`Capa de ${p.title}`}
          title={p.title}
          loading="lazy"
          decoding="async"
          className={`${size} w-auto max-w-[45%] rounded-md border-2 border-white bg-white object-contain shadow-md ${i > 0 ? '-ml-4' : ''}`}
          style={{ zIndex: shown.length - i }}
        />
      ))}
      {rest > 0 && (
        <span className="-ml-2 flex h-10 min-w-10 items-center justify-center rounded-full bg-petrol px-2 text-xs font-bold text-white shadow-md">
          +{rest}
        </span>
      )}
    </div>
  )
}
