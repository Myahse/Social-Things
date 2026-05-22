/**
 * REST paths expected from the Java backend (e.g. Spring Boot).
 * Implement these controllers on the server; Shopify checkout is handled there.
 */
export const endpoints = {
  products: '/products',
  productBySlug: (slug: string) => `/products/${encodeURIComponent(slug)}`,
  checkout: '/checkout',
} as const
