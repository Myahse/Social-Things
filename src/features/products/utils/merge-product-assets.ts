import { PRODUCT_ASSETS_BY_SLUG } from '@/features/products/config/product-assets'
import type { Product } from '@/features/products/types'

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
  const trackerImages = product.images ?? []

  if (!assets) {
    return {
      ...product,
      images: uniqueUrls(product.image, ...trackerImages),
    }
  }

  return {
    ...product,
    image: assets.product,
    imageAvatar: assets.avatar,
    images: uniqueUrls(
      assets.product,
      assets.avatar,
      ...assets.extras,
      product.image,
      ...trackerImages,
    ),
  }
}

export function withProductAssetsList(products: Product[]): Product[] {
  return products.map(withProductAssets)
}
