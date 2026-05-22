import type { Product } from '../types/product'
import { products as fallbackProducts, getProductBySlug as getFallbackBySlug } from '../data/products'
import { apiFetch } from './client'
import { endpoints } from './endpoints'

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
    return getFallbackBySlug(slug)
  }
}
