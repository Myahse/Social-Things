import type { Product } from '@/features/products/types'

export const fallbackProducts: Product[] = []

export function getFallbackProductBySlug(_slug: string): Product | undefined {
  return undefined
}
