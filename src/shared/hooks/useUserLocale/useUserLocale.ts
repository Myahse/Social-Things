import { SITE_LOCALE } from '@/shared/config/site-locale'

export interface UserLocale {
  city: string
  country: string
  timeZone: string
}

export function useUserLocale(): UserLocale {
  return {
    city: SITE_LOCALE.city,
    country: SITE_LOCALE.country,
    timeZone: SITE_LOCALE.timeZone,
  }
}
