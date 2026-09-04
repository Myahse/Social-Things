import { getApiBaseUrl } from '@/shared/api/client'

export function resolveShopImage(url: string | undefined | null): string | undefined {
  if (!url) return undefined

  const inventoryPublic = url.match(/\/api\/public\/inventory\/([^/?#]+)\/image/)
  if (inventoryPublic?.[1]) {
    return `${getApiBaseUrl()}/media/inventory/${inventoryPublic[1]}`
  }

  const galleryPublic = url.match(/\/api\/public\/gallery\/([^/?#]+)\/image/)
  if (galleryPublic?.[1]) {
    return `${getApiBaseUrl()}/media/gallery/${galleryPublic[1]}`
  }

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url
  }

  if (url.startsWith('/media/')) {
    return `${getApiBaseUrl()}${url}`
  }

  if (url.startsWith('/api/media/')) {
    return `${getApiBaseUrl().replace(/\/api\/?$/, '')}${url}`
  }

  return url
}
