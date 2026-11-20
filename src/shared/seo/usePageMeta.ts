import { useEffect } from 'react'
import { SITE_URL } from '@/shared/config/site-url'

export const SITE_NAME = 'SOCIAL THINGS'

export interface PageMeta {
  /** Page name, e.g. "Products"; the tab title becomes "Products | SOCIAL THINGS". Empty for the home page. */
  title: string
  description: string
  /** Canonical path on the public site, e.g. "/product/l539". Omit on private pages. */
  path?: string
  /** Share image: an absolute URL, or a path on the site. Defaults to /og-image.jpg. */
  image?: string
  type?: 'website' | 'product'
  /** Keep the page out of search results (account, cart, orders, not-found). */
  noindex?: boolean
  /** Structured data (schema.org) for the page. */
  jsonLd?: Record<string, unknown> | null
}

const DEFAULT_IMAGE = '/og-image.jpg'
const JSON_LD_ID = 'page-jsonld'

/** The defaults from index.html, read once so a page leaving can put them back. */
const DEFAULTS =
  typeof document === 'undefined'
    ? { title: SITE_NAME, description: '' }
    : {
        title: document.title || SITE_NAME,
        description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '',
      }

function absolute(url: string) {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (href == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: Record<string, unknown> | null) {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (data == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = JSON_LD_ID
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Sets the page's search and share tags: tab title, description, canonical URL, Open Graph / X tags,
 * robots (noindex) and schema.org data. Search engines run the app, so they read these; link-preview
 * crawlers don't, and fall back to the defaults in index.html. Put back to the defaults when the page leaves.
 */
export function usePageMeta(meta: PageMeta) {
  const { title, description, path, image, type = 'website', noindex = false } = meta
  const jsonLd = meta.jsonLd ? JSON.stringify(meta.jsonLd) : ''

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULTS.title
    const url = path != null ? absolute(path) : null
    const img = absolute(image || DEFAULT_IMAGE)

    document.title = fullTitle
    setMeta('name', 'description', description)
    setCanonical(noindex ? null : url)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : null)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', noindex ? null : url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:image', img)
    setJsonLd(jsonLd ? (JSON.parse(jsonLd) as Record<string, unknown>) : null)

    return () => {
      document.title = DEFAULTS.title
      setMeta('name', 'description', DEFAULTS.description)
      setCanonical(null)
      setMeta('name', 'robots', null)
      setMeta('property', 'og:title', DEFAULTS.title)
      setMeta('property', 'og:description', DEFAULTS.description)
      setMeta('property', 'og:type', 'website')
      setMeta('property', 'og:url', null)
      setMeta('property', 'og:image', absolute(DEFAULT_IMAGE))
      setMeta('name', 'twitter:image', absolute(DEFAULT_IMAGE))
      setJsonLd(null)
    }
  }, [title, description, path, image, type, noindex, jsonLd])
}
