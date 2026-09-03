import { usePageRevealOptional } from '@/shared/context/PageRevealContext'
import { onHomeNavClick } from '@/features/intro/config/on-home-nav'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { useI18n } from '@/shared/i18n/i18n'
import { BrandLogo } from '@/shared/layout/BrandNav'
import { HomeHeaderDesktop } from '@/shared/layout/HomeHeaderDesktop'
import { YOUTH_LABEL_WIDE_CLASS } from '@/shared/layout/youth-type'

interface HeaderProps {
  transparent?: boolean
  footerThemeDark?: boolean
}

export function Header({ transparent = false, footerThemeDark = false }: HeaderProps) {
  const intro = useIntroOptional()
  const { lang, setLang } = useI18n()
  const pageReveal = usePageRevealOptional()
  const staggerSides = !intro?.isPlaying && pageReveal != null
  const revealCount = staggerSides ? pageReveal.sideRevealCount : undefined

  const logoNudge = transparent ? '' : 'translate-y-2'
  const langClass = footerThemeDark
    ? `${YOUTH_LABEL_WIDE_CLASS} text-canvas/85`
    : `${YOUTH_LABEL_WIDE_CLASS} text-ink/70`

  return (
    <header
      className={
        transparent
          ? 'sticky top-0 z-50 bg-transparent'
          : 'sticky top-0 z-50 bg-canvas/90 backdrop-blur-md'
      }
    >
      {/* Mobile: language + logo — nav lives in bottom bar */}
      <div className="mx-auto grid h-[var(--header-height)] max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-[var(--site-gutter)] pt-[env(safe-area-inset-top,0px)] md:hidden">
        <button
          type="button"
          className={`justify-self-start px-1 py-2 text-sm ${langClass}`}
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          aria-label="Change language"
        >
          {lang === 'fr' ? 'FR' : 'US'}
        </button>
        <BrandLogo
          home
          onDark={footerThemeDark}
          className={logoNudge}
          onNavigateHome={() => onHomeNavClick(intro)}
        />
        <span aria-hidden />
      </div>

      {/* Desktop: same sidebar format on every page */}
      <HomeHeaderDesktop
        logo={
          <BrandLogo
            home
            onDark={footerThemeDark}
            className={logoNudge}
            onNavigateHome={() => onHomeNavClick(intro)}
          />
        }
        theme={footerThemeDark ? 'dark' : 'light'}
        revealCount={revealCount}
      />
    </header>
  )
}
