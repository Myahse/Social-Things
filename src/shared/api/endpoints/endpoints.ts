/**
 * REST paths expected from the Java backend (e.g. Spring Boot).
 */
export const endpoints = {
  products: '/products',
  productBySlug: (slug: string) => `/products/${encodeURIComponent(slug)}`,
  checkout: '/checkout',
} as const
