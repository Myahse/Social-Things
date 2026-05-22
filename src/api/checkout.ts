import type { CartItem } from '../types/product'
import { apiFetch } from './client'
import { endpoints } from './endpoints'
import type { CheckoutRequest, CheckoutResponse } from './types'

/**
 * Sends the cart to the Java backend. The server builds the Shopify checkout
 * URL (variant mapping, cart permalink, or Storefront API) and returns it.
 */
export async function createCheckoutSession(items: CartItem[]): Promise<string> {
  const body: CheckoutRequest = {
    items: items.map((item) => ({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
  }

  const { checkoutUrl } = await apiFetch<CheckoutResponse>(endpoints.checkout, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!checkoutUrl) {
    throw new Error('Backend did not return a checkout URL')
  }

  return checkoutUrl
}
