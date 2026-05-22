import { Link } from 'react-router-dom'
import { ProductCard } from '@/features/products/components/ProductCard'
import type { Product } from '@/features/products/types'

interface CollectionSectionProps {
  products: Product[]
  loading: boolean
  error: string | null
}

export function CollectionSection({ products, loading, error }: CollectionSectionProps) {
  return (
    <section id="collection" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl">The collection</h2>
          <p className="mt-2 text-muted">Tap a piece to view details and add to cart.</p>
        </div>
        <Link
          to="/cart"
          className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          View cart
        </Link>
      </div>

      {loading && <p className="text-center text-muted">Loading collection…</p>}
      {error && <p className="text-center text-sm text-accent">{error}</p>}

      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
