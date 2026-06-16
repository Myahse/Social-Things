import { Link } from 'react-router-dom'
import type { Product } from '@/features/products/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group">
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-2xl border border-line bg-canvas/60 backdrop-blur-md transition-colors hover:bg-canvas"
      >
        <div className="aspect-[4/5] overflow-hidden bg-accent-soft/25">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-3">
        <div className="font-semibold tracking-tight text-ink">{product.name}</div>
        <div className="mt-1 text-sm font-light leading-relaxed text-muted">
          {product.description}
        </div>
      </div>
    </div>
  )
}
