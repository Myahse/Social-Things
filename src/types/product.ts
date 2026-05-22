export interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  image: string
  colors: string[]
  sizes: string[]
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}
