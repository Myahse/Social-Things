const assetModules = import.meta.glob<string>(
  '@/assets/product/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

export type ProductAssetPair = {
  product: string
  avatar: string
}

function classifyFilename(filename: string): 'product' | 'avatar' | null {
  const lower = filename.toLowerCase()
  if (/^avatar\.|\/avatar\.|avatar/.test(lower)) return 'avatar'
  if (/^product\.|\/product\.|product/.test(lower)) return 'product'
  return null
}

function slugFromPath(path: string): string | null {
  const match = path.match(/\/product\/([^/]+)\//i)
  return match?.[1] ?? null
}

function buildProductAssets(): Record<string, ProductAssetPair> {
  const buckets = new Map<string, { product?: string; avatar?: string; other: string[] }>()

  for (const [path, src] of Object.entries(assetModules)) {
    const slug = slugFromPath(path)
    if (!slug) continue

    const filename = path.split('/').pop() ?? ''
    const kind = classifyFilename(filename)
    const entry = buckets.get(slug) ?? { other: [] }
    buckets.set(slug, entry)

    if (kind === 'avatar') entry.avatar = src
    else if (kind === 'product') entry.product = src
    else entry.other.push(src)
  }

  const result: Record<string, ProductAssetPair> = {}

  for (const [slug, entry] of buckets) {
    const product = entry.product ?? entry.other[0]
    const avatar = entry.avatar ?? entry.other.find((src) => src !== product) ?? product

    if (product) {
      result[slug] = { product, avatar }
    }
  }

  return result
}

/** Local images: `src/assets/product/{slug}/product.*` + `avatar.*` */
export const PRODUCT_ASSETS_BY_SLUG = buildProductAssets()
