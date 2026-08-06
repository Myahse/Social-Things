/** Request body for POST /api/checkout */
export interface CheckoutLineRequest {
  productId: string
  size: string
  color: string
  quantity: number
}

export interface CheckoutRequest {
  items: CheckoutLineRequest[]
  email?: string
  shipping?: {
    name?: string
    line1?: string
    city?: string
    region?: string
    postal?: string
    country?: string
  }
}

/** Response from Java after creating a checkout session / order */
export interface CheckoutResponse {
  checkoutUrl: string
  orderId?: string
}
