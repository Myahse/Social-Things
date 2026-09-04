import type { GalleryImage } from '@/features/gallery/config/gallery-images'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

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
      .filter((row) => Boolean(row.src) && !String(row.src).startsWith('data:'))
      .map((row, index) => ({
        src: String(row.src),
        alt: row.alt?.trim() || row.group || `Look ${index + 1}`,
        group: row.group?.trim() || 'all',
      }))
  } catch {
    return []
  }
}
