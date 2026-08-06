export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  image: string
  /** On-body shot (`avatar.*` in assets) — shown on card hover. */
  imageAvatar?: string
  colors: string[]
  sizes: string[]
}
