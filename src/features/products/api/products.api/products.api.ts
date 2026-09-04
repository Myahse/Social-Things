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

const PRODUCT_CACHE_MS = 20_000
let productsCache: Product[] | null = null
let productsCacheAt = 0
let productsInFlight: Promise<Product[]> | null = null

export async function fetchProducts(): Promise<Product[]> {
  if (!isJavaApiEnabled()) {
    return withProductAssetsList(fallbackProducts)
  }

  const now = Date.now()
  if (productsCache && now - productsCacheAt < PRODUCT_CACHE_MS) {
    return productsCache
  }
  if (productsInFlight) {
    return productsInFlight
  }

  productsInFlight = apiFetch<Product[]>(endpoints.products)
    .then((products) => {
      const next = withProductAssetsList(products)
      productsCache = next
      productsCacheAt = Date.now()
      return next
    })
    .finally(() => {
      productsInFlight = null
    })

  return productsInFlight
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isJavaApiEnabled()) {
    const product = getFallbackProductBySlug(slug)
    return product ? withProductAssets(product) : undefined
  }

  const cached = productsCache?.find((product) => product.slug === slug)
  if (cached) {
    return cached
  }

  try {
    const product = await apiFetch<Product>(endpoints.productBySlug(slug))
    return withProductAssets(product)
  } catch {
    return undefined
  }
}
