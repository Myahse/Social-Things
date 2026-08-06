import { PRODUCT_ASSETS_BY_SLUG } from '@/features/products/config/product-assets'
import type { Product } from '@/features/products/types'

export function withProductAssets(product: Product): Product {
  const assets = PRODUCT_ASSETS_BY_SLUG[product.slug]
  if (!assets) return product

  return {
    ...product,
    image: assets.product,
    imageAvatar: assets.avatar,
  }
}

export function withProductAssetsList(products: Product[]): Product[] {
  return products.map(withProductAssets)
}
