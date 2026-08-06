import { Link } from 'react-router-dom'
import { getApiBaseUrl } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'

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
    <aside
      className="h-fit border-[3px] border-ink bg-canvas p-6 shadow-[8px_8px_0_var(--color-ink)]"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
      }}
    >
      <div className="flex justify-between text-sm">
        <span className="text-muted">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(0)}</span>
      </div>
      <p className="mt-2 text-xs text-muted">
        Shipping and taxes calculated at checkout on Shopify.
      </p>

      {checkoutError && (
        <p className="mt-4 border-2 border-ink bg-accent-soft px-3 py-2 text-sm text-ink">
          {checkoutError}
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckingOut}
        className="btn-slam mt-6 w-full"
      >
        <span>{isCheckingOut ? 'Redirecting…' : 'Checkout with Shopify'}</span>
      </button>

      <p className="mt-3 text-xs text-muted">
        {isJavaApiEnabled() ? (
          <>
            Checkout is handled by the Java API ({getApiBaseUrl()}/checkout), which redirects
            to Shopify for payment.
          </>
        ) : (
          <>Dev mode: using local product data. Enable the Java API to test checkout.</>
        )}
      </p>

      <Link
        to="/product"
        className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        Continue shopping
      </Link>
    </aside>
  )
}
