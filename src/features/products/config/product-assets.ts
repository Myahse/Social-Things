const assetModules = import.meta.glob<string>(
  '@/assets/product/**/*.{png,jpg,jpeg,webp,avif}',
  { eager: true, import: 'default' },
)

export type ProductAssetPair = {
  product: string
  avatar: string
  extras: string[]
}

/** Print artwork for the 3D Avatar view: `print-front.*` / `print-back.*` (kept out of the photo gallery). */
const PRINT_FILE = /^print-(front|back)\./

function classifyFilename(filename: string): 'product' | 'avatar' | 'print' | null {
  const lower = filename.toLowerCase()
  if (PRINT_FILE.test(lower)) return 'print'
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
    if (kind === 'print') continue
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
      const extras = entry.other.filter((src) => src !== product && src !== avatar)
      result[slug] = { product, avatar, extras }
    }
  }

  return result
}

/** Local images: `src/assets/product/{slug}/product.*` + `avatar.*` */
export const PRODUCT_ASSETS_BY_SLUG = buildProductAssets()

export type ProductPrintFiles = { front?: string; back?: string }

function buildProductPrints(): Record<string, ProductPrintFiles> {
  const result: Record<string, ProductPrintFiles> = {}
  for (const [path, src] of Object.entries(assetModules)) {
    const slug = slugFromPath(path)
    const side = (path.split('/').pop() ?? '').toLowerCase().match(PRINT_FILE)?.[1] as 'front' | 'back' | undefined
    if (!slug || !side) continue
    result[slug] = { ...result[slug], [side]: src }
  }
  return result
}

/** Print artwork for the 3D Avatar view: `src/assets/product/{slug}/print-front.*` + `print-back.*` */
export const PRODUCT_PRINTS_BY_SLUG = buildProductPrints()
