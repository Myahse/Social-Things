/** Brand locale shown bottom-right (override via VITE_SITE_* env). */
export const SITE_LOCALE = {
  city: import.meta.env.VITE_SITE_CITY ?? 'Minneapolis',
  country: import.meta.env.VITE_SITE_COUNTRY ?? 'Minnesota',
  timeZone: import.meta.env.VITE_SITE_TIMEZONE ?? 'America/Chicago',
} as const
