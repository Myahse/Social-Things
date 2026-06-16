import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import logoUrl from '@/assets/logo.png'
import { BRAND_NAV_ROW_CLASS } from '@/shared/layout/brand-cluster'
import { BRAND_NAV_ITEMS } from './nav-items'
import { useI18n } from '@/shared/i18n/i18n'


const NAV_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
export const BRAND_NAV_SLIDE_MS = 1100
interface BrandNavProps {
  revealed?: boolean
  emergeFromLogo?: boolean
  slideFromLeft?: boolean
  className?: string
}

function BrandNavLinks({ revealed = true }: { revealed?: boolean }) {
  const { t } = useI18n()
  return (
    <>
      {BRAND_NAV_ITEMS.map(({ to, key, ...rest }) => (
        <NavLink
          key={to}
          to={to}
          end={'end' in rest ? rest.end : undefined}
          className={({ isActive }) =>
            `whitespace-nowrap ${isActive ? 'text-ink' : 'text-muted transition-colors hover:text-ink'}`
          }
          tabIndex={revealed ? 0 : -1}
        >
          {t(key)}
        </NavLink>
      ))}
    </>
  )
}

function NavSlideReveal({
  revealed,
  className,
  children,
}: {
  revealed: boolean
  className?: string
  children: ReactNode
}) {
  const clipHidden = 'inset(0 100% 0 0)'
  const clipVisible = 'inset(0 0 0 0)'

  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-hidden={!revealed}>
      <div
        className="will-change-[clip-path]"
        style={{
          clipPath: revealed ? clipVisible : clipHidden,
          transition: `clip-path ${BRAND_NAV_SLIDE_MS}ms ${NAV_EASE}`,
        }}
      >
        <div
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateX(0)' : 'translateX(-12px)',
            transition: [
              `opacity ${BRAND_NAV_SLIDE_MS * 0.65}ms ${NAV_EASE}`,
              `transform ${BRAND_NAV_SLIDE_MS}ms ${NAV_EASE}`,
            ].join(', '),
            transitionDelay: revealed ? '140ms' : '0ms',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function BrandNav({
  revealed = true,
  emergeFromLogo = false,
  slideFromLeft = false,
  className = '',
}: BrandNavProps) {
  const clipHidden = 'inset(0 100% 0 0)'
  const clipVisible = 'inset(0 0 0 0)'

  if (slideFromLeft) {
    return (
      <NavSlideReveal revealed={revealed} className={className}>
        <nav className={`${BRAND_NAV_ROW_CLASS} !pl-0`}>
          <BrandNavLinks revealed={revealed} />
        </nav>
      </NavSlideReveal>
    )
  }

  if (emergeFromLogo) {
    return (
      <div
        className={`absolute top-1/2 left-full z-10 max-w-[calc(100vw-var(--site-gutter)*2-6rem)] -translate-y-1/2 min-[480px]:max-w-none ${className}`}
        aria-hidden={!revealed}
      >
        <div
          className="overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: revealed ? clipVisible : clipHidden,
            transition: `clip-path ${BRAND_NAV_SLIDE_MS}ms ${NAV_EASE}`,
          }}
        >
          <nav
            className={BRAND_NAV_ROW_CLASS}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(-12px)',
              transition: [
                `opacity ${BRAND_NAV_SLIDE_MS * 0.65}ms ${NAV_EASE}`,
                `transform ${BRAND_NAV_SLIDE_MS}ms ${NAV_EASE}`,
              ].join(', '),
              transitionDelay: revealed ? '140ms' : '0ms',
            }}
          >
            <BrandNavLinks revealed={revealed} />
          </nav>
        </div>
      </div>
    )
  }

  return (
    <nav
      className={`${BRAND_NAV_ROW_CLASS} ${className}`}
      aria-hidden={!revealed}
    >
      <BrandNavLinks revealed={revealed} />
    </nav>
  )
}

import { HOME_HEADER_LOGO_CLASS } from '@/shared/layout/brand-cluster'

export function BrandLogo({
  compact = false,
  home = false,
  className = '',
  onNavigateHome,
}: {
  compact?: boolean
  home?: boolean
  className?: string
  /** Skip the 3D intro when navigating home from the header logo. */
  onNavigateHome?: () => void
}) {
  const sizeClass = home
    ? HOME_HEADER_LOGO_CLASS
    : compact
      ? 'h-[var(--brand-logo-compact)] w-[var(--brand-logo-compact)]'
      : 'h-full w-full'

  return (
    <NavLink
      to="/"
      end
      onClick={() => onNavigateHome?.()}
      className={`block shrink-0 overflow-hidden transition-opacity hover:opacity-90 ${className}`}
      aria-label="Home"
    >
      <img src={logoUrl} alt="" className={`object-contain ${sizeClass}`} />
    </NavLink>
  )
}
