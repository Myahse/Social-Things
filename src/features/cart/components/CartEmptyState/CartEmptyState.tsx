import { Link } from 'react-router-dom'

export function CartEmptyState() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-3xl">Your cart is empty</h1>
      <p className="mt-4 text-muted">Add something from the collection.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-canvas"
      >
        Continue shopping
      </Link>
    </div>
  )
}
