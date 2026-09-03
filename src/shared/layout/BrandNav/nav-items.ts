export const BRAND_NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/product', key: 'nav.products' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/#faq', key: 'nav.faq' },
  { to: '/about', key: 'nav.about' },
] as const

/** Phone tab bar — FAQ lives on home, so it is omitted to keep six tap targets. */
export const MOBILE_BOTTOM_NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/product', key: 'nav.products' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/about', key: 'nav.about' },
  { to: '/account', key: 'nav.account' },
  { to: '/cart', key: 'nav.cart' },
] as const

export function navItemIndex(id: string) {
  const navIdx = BRAND_NAV_ITEMS.findIndex((item) => item.to === id)
  if (navIdx !== -1) return navIdx
  if (id === '/account') return BRAND_NAV_ITEMS.length
  if (id === '/cart') return BRAND_NAV_ITEMS.length + 1
  return BRAND_NAV_ITEMS.length + 2
}

export function mobileNavItemIndex(id: string) {
  const idx = MOBILE_BOTTOM_NAV_ITEMS.findIndex((item) => item.to === id)
  return idx === -1 ? MOBILE_BOTTOM_NAV_ITEMS.length : idx
}
