import {
  fallbackProducts,
  getFallbackProductBySlug,
} from '@/features/products/data/fallback-products'
import type { Product } from '@/features/products/types'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

export async function fetchProducts(): Promise<Product[]> {
  if (!isJavaApiEnabled()) {
    return fallbackProducts
  }

  try {
    return await apiFetch<Product[]>(endpoints.products)
  } catch {
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isJavaApiEnabled()) {
    return getFallbackProductBySlug(slug)
  }

  try {
    return await apiFetch<Product>(endpoints.productBySlug(slug))
  } catch {
    return getFallbackProductBySlug(slug)
  }
}
