/** Request body for POST /api/checkout */
export interface CheckoutLineRequest {
  productId: string
  size: string
  color: string
  quantity: number
}

export interface CheckoutRequest {
  items: CheckoutLineRequest[]
}

/** Response from Java after creating a Shopify checkout session */
export interface CheckoutResponse {
  checkoutUrl: string
}
