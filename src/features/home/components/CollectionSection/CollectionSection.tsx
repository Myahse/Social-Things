import { Link } from 'react-router-dom'
import { ProductCard } from '@/features/products/components/ProductCard'
import type { Product } from '@/features/products/types'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
interface CollectionSectionProps {
  products: Product[]
  loading: boolean
  error: string | null
}

export function CollectionSection({ products, loading, error }: CollectionSectionProps) {
  return (
    <section
      id="collection"
      className="mx-auto min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6"
    >
      <StaggerReveal index={0} className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl">The collection</h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Tap a piece to view details and add to cart.
          </p>
        </div>
        <Link
          to="/cart"
          className="shrink-0 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          View cart
        </Link>
      </StaggerReveal>

      <StaggerReveal index={1}>
        {loading && <p className="text-center text-muted">Loading collection…</p>}
        {error && <p className="text-center text-sm text-accent">{error}</p>}
      </StaggerReveal>

      {!loading && (
        <StaggerReveal index={2}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </StaggerReveal>
      )}
    </section>
  )
}
