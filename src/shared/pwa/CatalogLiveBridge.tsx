import { useEffect } from 'react'
import { invalidateProductsCache } from '@/features/products/api/products.api'
import { subscribeCatalogUpdates } from '@/shared/api/catalog-socket'
import { notifyCatalogChange } from '@/shared/pwa/notifications'

export const CATALOG_CHANGED_EVENT = 'st:catalog-changed'

export function CatalogLiveBridge() {
  useEffect(() => {
    return subscribeCatalogUpdates((reason) => {
      invalidateProductsCache()
      window.dispatchEvent(new CustomEvent(CATALOG_CHANGED_EVENT, { detail: reason }))
      notifyCatalogChange(reason)
    })
  }, [])

  return null
}
