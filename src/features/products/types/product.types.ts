export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  image: string
  /** Extra shots from tracker + local assets. Includes the cover when present. */
  images?: string[]
  /** On-body shot (`avatar.*` in assets) — shown on card hover. */
  imageAvatar?: string
  colors: string[]
  sizes: string[]
  /** Print artwork for the 3D Avatar view (`print-front.*` / `print-back.*` in assets). */
  prints?: { front?: string; back?: string }
  /** Flat design mockups (`mockup*.*` in assets) for the product page's Mockup view. */
  mockups?: string[]
  /** From the API: first added to the inventory within the last 14 days. */
  newArrival?: boolean
  /** From the API: among the most-ordered products. */
  bestSeller?: boolean
  /** From `config/offers.ts`: the regular price while the product is on offer (higher than `price`). */
  compareAtPrice?: number
}
