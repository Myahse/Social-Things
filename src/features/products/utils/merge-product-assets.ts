import { PRODUCT_ASSETS_BY_SLUG } from '@/features/products/config/product-assets'
import type { Product } from '@/features/products/types'
import { getApiBaseUrl } from '@/shared/api/client'

function resolveShopImage(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('/media/')) {
    return `${getApiBaseUrl()}${url}`
  }
  return url
}

function uniqueUrls(...urls: Array<string | undefined | null>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const url of urls) {
    if (!url || seen.has(url)) continue
    seen.add(url)
    out.push(url)
  }
  return out
}

export function productGallery(product: Product): string[] {
  return uniqueUrls(product.image, ...(product.images ?? []), product.imageAvatar)
}

export function withProductAssets(product: Product): Product {
  const assets = PRODUCT_ASSETS_BY_SLUG[product.slug]
  const cover = resolveShopImage(product.image)
  const trackerImages = (product.images ?? []).map((src) => resolveShopImage(src)).filter(Boolean) as string[]

  if (!assets) {
    return {
      ...product,
      image: cover ?? '',
      images: uniqueUrls(cover, ...trackerImages),
    }
  }

  return {
    ...product,
    image: cover || assets.product,
    imageAvatar: assets.avatar,
    images: uniqueUrls(cover, ...trackerImages, assets.product, assets.avatar, ...assets.extras),
  }
}

export function withProductAssetsList(products: Product[]): Product[] {
  return products.map(withProductAssets)
}
