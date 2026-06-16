/** Shared layout tokens — values live in `index.css` as CSS variables. */
export const BRAND_NAV_ROW_CLASS =
  'flex h-[var(--header-height)] max-w-[min(100vw,20rem)] items-center gap-2 overflow-hidden pl-2 text-xs whitespace-nowrap min-[400px]:max-w-none sm:gap-4 sm:pl-4 sm:text-sm md:gap-6 md:pl-5'

export const SITE_HEADER_INNER_CLASS =
  'mx-auto grid h-[var(--header-height)] w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-[var(--site-gutter)]'

export const BRAND_CLUSTER_CLASS =
  'relative -ml-[var(--brand-cluster-nudge)] inline-flex items-center justify-center'

export const SITE_HEADER_HOME_CLASS =
  'relative mx-auto grid h-[var(--header-height)] w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 px-[var(--site-gutter)]'

export const HOME_HEADER_LOGO_CLASS =
  'h-[var(--brand-logo-home)] max-h-[calc(var(--header-height)-0.1rem)] w-[var(--brand-logo-home)] max-w-[min(var(--brand-logo-home),calc(100vw-12rem))]'
