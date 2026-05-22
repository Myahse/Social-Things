import {
  fallbackProducts,
  getFallbackProductBySlug,
} from '@/features/products/data/fallback-products'
import type { Product } from '@/features/products/types'
import { apiFetch } from '@/shared/api/client'
import { endpoints } from '@/shared/api/endpoints'

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(endpoints.products)
  } catch {
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    return await apiFetch<Product>(endpoints.productBySlug(slug))
  } catch {
    return getFallbackProductBySlug(slug)
  }
}
