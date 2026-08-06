import { useEffect, useState } from 'react'
import type { Language } from '@/shared/i18n/i18n'
import { useUserLocale } from '@/shared/hooks/useUserLocale'

import { YOUTH_LABEL_CLASS, YOUTH_LABEL_TIGHT_CLASS } from '@/shared/layout/youth-type'

function formatTime(date: Date, lang: Language, timeZone: string) {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone,
  }).format(date)
}

interface SiteLocaleInfoProps {
  lang: Language
  onDark: boolean
}

export function SiteLocaleInfo({ lang, onDark }: SiteLocaleInfoProps) {
  const { city, country, timeZone } = useUserLocale()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const textClass = onDark ? 'text-canvas/85' : 'text-ink/70'

  return (
    <div
      className={`pointer-events-none fixed right-6 bottom-6 z-[60] hidden flex-col items-end text-right md:flex ${textClass}`}
      aria-live="polite"
    >
      <p className={`text-base leading-tight uppercase ${YOUTH_LABEL_CLASS}`}>{city}</p>
      {country ? (
        <p className={`mt-0.5 text-base leading-tight uppercase ${YOUTH_LABEL_CLASS}`}>{country}</p>
      ) : null}
      <time
        dateTime={now.toISOString()}
        className={`mt-1 block text-base tabular-nums ${YOUTH_LABEL_TIGHT_CLASS}`}
      >
        {formatTime(now, lang, timeZone)}
      </time>
    </div>
  )
}
