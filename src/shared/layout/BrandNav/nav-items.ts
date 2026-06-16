export const BRAND_NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/product', key: 'nav.catalog' },
  { to: '/about', key: 'nav.about' },
] as const

export const MOBILE_BOTTOM_NAV_ITEMS = [
  ...BRAND_NAV_ITEMS,
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
