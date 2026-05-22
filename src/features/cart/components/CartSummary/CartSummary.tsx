import { Link } from 'react-router-dom'
import { getApiBaseUrl } from '@/shared/api/client'

interface CartSummaryProps {
  subtotal: number
  checkoutError: string | null
  isCheckingOut: boolean
  onCheckout: () => void
}

export function CartSummary({
  subtotal,
  checkoutError,
  isCheckingOut,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside className="h-fit rounded-lg border border-line bg-white p-6">
      <div className="flex justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(0)}</span>
      </div>
      <p className="mt-2 text-xs text-muted">
        Shipping and taxes calculated at checkout on Shopify.
      </p>

      {checkoutError && (
        <p className="mt-4 rounded-md bg-accent-soft px-3 py-2 text-sm text-accent">
          {checkoutError}
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckingOut}
        className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-medium text-canvas transition-opacity disabled:opacity-60"
      >
        {isCheckingOut ? 'Redirecting…' : 'Checkout with Shopify'}
      </button>

      <p className="mt-3 text-xs text-muted">
        Checkout is handled by the Java API ({getApiBaseUrl()}/checkout), which redirects
        to Shopify for payment.
      </p>

      <Link
        to="/"
        className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        Continue shopping
      </Link>
    </aside>
  )
}
