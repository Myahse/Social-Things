import { useEffect, useState } from 'react'
import { fetchGallery } from '@/features/gallery/api/gallery.api'
import type { GalleryImage } from '@/features/gallery/config/gallery-images'
import { CATALOG_CHANGED_EVENT } from '@/shared/pwa'

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    function load(silent = false) {
      if (!silent) setLoading(true)
      return fetchGallery()
        .then((data) => {
          if (!cancelled) setImages(data)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    void load()
    const onCatalog = () => {
      void load(true)
    }
    window.addEventListener(CATALOG_CHANGED_EVENT, onCatalog)

    return () => {
      cancelled = true
      window.removeEventListener(CATALOG_CHANGED_EVENT, onCatalog)
    }
  }, [])

  return { images, loading }
}
