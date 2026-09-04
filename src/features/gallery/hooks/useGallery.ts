import { useEffect, useState } from 'react'
import { fetchGallery } from '@/features/gallery/api/gallery.api'
import type { GalleryImage } from '@/features/gallery/config/gallery-images'

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchGallery()
      .then((data) => {
        if (!cancelled) setImages(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { images, loading }
}
