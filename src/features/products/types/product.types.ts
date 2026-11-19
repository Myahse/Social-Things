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
}
