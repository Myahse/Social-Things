/** The public storefront address (shared links, share cards). Override with VITE_SITE_URL. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.socialthngs.com'
