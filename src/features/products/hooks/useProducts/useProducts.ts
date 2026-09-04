import { useEffect, useState } from 'react'
import { fetchProducts, invalidateProductsCache } from '@/features/products/api/products.api'
import type { Product } from '@/features/products/types'
import { subscribeCatalogUpdates } from '@/shared/api/catalog-socket'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    function load(silent = false) {
      if (!silent) setLoading(true)
      return fetchProducts()
        .then((data) => {
          if (!cancelled) {
            setProducts(data)
            setError(null)
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to load products')
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    void load()
    const stop = subscribeCatalogUpdates(() => {
      invalidateProductsCache()
      void load(true)
    })

    return () => {
      cancelled = true
      stop()
    }
  }, [])

  return { products, loading, error }
}
