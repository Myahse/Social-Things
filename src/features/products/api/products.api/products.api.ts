import {
  fallbackProducts,
  getFallbackProductBySlug,
} from '@/features/products/data/fallback-products'
import type { Product } from '@/features/products/types'
import {
  withProductAssets,
  withProductAssetsList,
} from '@/features/products/utils/merge-product-assets'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

export async function fetchProducts(): Promise<Product[]> {
  if (!isJavaApiEnabled()) {
    return withProductAssetsList(fallbackProducts)
  }

  try {
    const products = await apiFetch<Product[]>(endpoints.products)
    return withProductAssetsList(products)
  } catch {
    return withProductAssetsList(fallbackProducts)
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isJavaApiEnabled()) {
    const product = getFallbackProductBySlug(slug)
    return product ? withProductAssets(product) : undefined
  }

  try {
    const product = await apiFetch<Product>(endpoints.productBySlug(slug))
    return withProductAssets(product)
  } catch {
    const product = getFallbackProductBySlug(slug)
    return product ? withProductAssets(product) : undefined
  }
}
