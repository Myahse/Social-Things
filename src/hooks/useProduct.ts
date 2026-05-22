import { useEffect, useState } from 'react'
import { fetchProductBySlug } from '../api/products'
import type { Product } from '../types/product'

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setProduct(undefined)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProductBySlug(slug)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, loading, error }
}
