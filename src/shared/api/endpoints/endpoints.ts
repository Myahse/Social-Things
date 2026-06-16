/**
 * REST paths expected from the Java backend (e.g. Spring Boot).
 */
export const endpoints = {
  products: '/products',
  productBySlug: (slug: string) => `/products/${encodeURIComponent(slug)}`,
  checkout: '/checkout',
  authSession: '/auth/session',
  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authLogout: '/auth/logout',
} as const
