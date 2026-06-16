import { usePageRevealOptional } from '@/shared/context/PageRevealContext'
import { onHomeNavClick } from '@/features/intro/config/on-home-nav'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { BrandLogo } from '@/shared/layout/BrandNav'
import { HomeHeaderDesktop } from '@/shared/layout/HomeHeaderDesktop'

interface HeaderProps {
  transparent?: boolean
  footerThemeDark?: boolean
}

export function Header({ transparent = false, footerThemeDark = false }: HeaderProps) {
  const intro = useIntroOptional()
  const pageReveal = usePageRevealOptional()
  const staggerSides = !intro?.isPlaying && pageReveal != null
  const revealCount = staggerSides ? pageReveal.sideRevealCount : undefined

  const logoNudge = transparent ? '' : 'translate-y-2'
  return (
    <header
      className={
        transparent
          ? 'sticky top-0 z-50 bg-transparent'
          : 'sticky top-0 z-50 bg-canvas/90 backdrop-blur-md'
      }
    >
      {/* Mobile: logo only — nav lives in bottom bar */}
      <div className="mx-auto flex h-[var(--header-height)] max-w-6xl items-center justify-center px-[var(--site-gutter)] md:hidden">
        <BrandLogo
          home
          className={logoNudge}
          onNavigateHome={() => onHomeNavClick(intro)}
        />
      </div>

      {/* Desktop: same sidebar format on every page */}
      <HomeHeaderDesktop
        logo={
          <BrandLogo
            home
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
