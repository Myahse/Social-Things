import { useState } from 'react'
import { createCheckoutSession } from '@/features/checkout/api/checkout.api'
import { CartEmptyState } from '@/features/cart/components/CartEmptyState'
import { CartLineItem } from '@/features/cart/components/CartLineItem'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { useCart } from '@/features/cart/context/CartContext'

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
    return <CartEmptyState />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl">Cart</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line">
          {items.map((item) => {
            const key = `${item.productId}-${item.size}-${item.color}`
            return (
              <CartLineItem
                key={key}
                item={item}
                onRemove={() => removeItem(item.productId, item.size, item.color)}
                onUpdateQuantity={(quantity) =>
                  updateQuantity(item.productId, item.size, item.color, quantity)
                }
              />
            )
          })}
        </ul>

        <CartSummary
          subtotal={subtotal}
          checkoutError={checkoutError}
          isCheckingOut={isCheckingOut}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  )
}
