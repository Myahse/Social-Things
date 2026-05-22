import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { useProducts } from '../hooks/useProducts'

export function HomePage() {
  const { products, loading, error } = useProducts()

  return (
    <>
      <section className="border-b border-line bg-ink px-4 py-20 text-canvas sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.2em] text-canvas/70">New season</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">
            Clothing made for everyday elevation
          </h1>
          <p className="mt-6 max-w-lg text-canvas/80">
            Essentials, outerwear, and accessories — designed with restraint and built to last.
          </p>
          <a
            href="#collection"
            className="mt-8 inline-block border border-canvas/40 px-6 py-3 text-sm transition-colors hover:bg-canvas hover:text-ink"
          >
            View collection
          </a>
        </div>
      </section>

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

        {loading && (
          <p className="text-center text-muted">Loading collection…</p>
        )}

        {error && (
          <p className="text-center text-sm text-accent">{error}</p>
        )}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
