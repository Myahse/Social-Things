import { Link } from 'react-router-dom'

export function CartEmptyState() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
      <h1 className="slash-title slash-title-ink text-3xl">Your cart is empty</h1>
      <p className="mt-4 text-muted">Add something from the collection.</p>
      <Link to="/" className="btn-slam mt-8">
        <span>Continue shopping</span>
      </Link>
    </div>
  )
}
