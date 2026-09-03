import type { CartItem } from '@/features/cart/types'
import type { CheckoutRequest, CheckoutResponse } from '@/features/checkout/types'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

/**
 * Sends the cart to the Java backend. The server saves the order and decrements tracker stock.
 */
export async function createCheckoutSession(items: CartItem[]): Promise<CheckoutResponse> {
  if (!isJavaApiEnabled()) {
    throw new Error(
      'Java API is offline. Start Spring Boot on port 8080 and set VITE_USE_JAVA_API=true in .env.development.',
    )
  }

  const body: CheckoutRequest = {
    items: items.map((item) => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
  }

  const response = await apiFetch<CheckoutResponse>(endpoints.checkout, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.orderId && !response.checkoutUrl) {
    throw new Error('Backend did not confirm the order')
  }

  return response
}
