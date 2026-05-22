import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createCheckoutSession } from '../api/checkout'
import { getApiBaseUrl } from '../api/client'
import { useCart } from '../context/CartContext'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  async function handleCheckout() {
    setCheckoutError(null)
    setIsCheckingOut(true)
    try {
      const checkoutUrl = await createCheckoutSession(items)
      window.location.href = checkoutUrl
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl">Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line">
          {items.map((item) => {
            const key = `${item.productId}-${item.size}-${item.color}`
            return (
              <li key={key} className="flex gap-4 py-6 first:pt-0">
                <Link
                  to={`/product/${item.slug}`}
                  className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-accent-soft/20"
                >
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>

                <div className="flex flex-1 flex-col justify-between sm:flex-row">
                  <div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {item.color} · {item.size}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="mt-2 text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-4 sm:mt-0">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity - 1,
                          )
                        }
                        className="px-3 py-1 text-lg leading-none hover:bg-accent-soft/50"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                        className="px-3 py-1 text-lg leading-none hover:bg-accent-soft/50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

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
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-medium text-canvas transition-opacity disabled:opacity-60"
          >
            {isCheckingOut ? 'Redirecting…' : 'Checkout with Shopify'}
          </button>

          <p className="mt-3 text-xs text-muted">
            Checkout is handled by the Java API ({getApiBaseUrl()}/checkout), which
            redirects to Shopify for payment.
          </p>

          <Link
            to="/"
            className="mt-4 block text-center text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
