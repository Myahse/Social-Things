import type { GalleryImage } from '@/features/gallery/config/gallery-images'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'
import { resolveShopImage } from '@/shared/media/resolveShopImage'

export async function fetchGallery(): Promise<GalleryImage[]> {
  if (!isJavaApiEnabled()) {
    return []
  }

  try {
    const rows = await apiFetch<Array<{ id?: string; group?: string; src?: string; alt?: string }>>(
      endpoints.gallery,
    )
    if (!Array.isArray(rows)) return []
    return rows
      .map((row, index) => {
        const src = resolveShopImage(row.src)
        if (!src || src.startsWith('data:')) return null
        return {
          id: row.id,
          src,
          alt: row.alt?.trim() || row.group || `Look ${index + 1}`,
          group: row.group?.trim() || 'all',
        }
      })
      .filter((row): row is GalleryImage => row != null)
  } catch {
    return []
  }
}
