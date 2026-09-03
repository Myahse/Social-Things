import { NavLink } from 'react-router-dom'
import { MOBILE_BOTTOM_NAV_ITEMS, mobileNavItemIndex } from '@/shared/layout/BrandNav/nav-items'
import { onHomeNavClick } from '@/features/intro/config/on-home-nav'
import { useCart } from '@/features/cart/context/CartContext'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { useI18n } from '@/shared/i18n/i18n'
import { STAGGER_EASE, STAGGER_REVEAL_MS } from '@/shared/motion/stagger'

function HomeIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3.25 2.75 11.1v1.4h2.4V21.25h5.35v-5.8h3v5.8h5.35V12.5h2.4v-1.4L12 3.25Z" />
    </svg>
  )
}

function GridIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.25 4.25h7.5v7.5h-7.5v-7.5Zm8.75 0h7.5v7.5H13v-7.5ZM4.25 13h7.5v7.5h-7.5V13Zm8.75 0h7.5v7.5H13V13Z" />
    </svg>
  )
}

function InfoIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12 21.25c5.11 0 9.25-4.14 9.25-9.25S17.11 2.75 12 2.75 2.75 6.89 2.75 12 6.89 21.25 12 21.25Zm.9-6.05a.9.9 0 1 1-1.8 0v-4.6a.9.9 0 1 1 1.8 0v4.6Zm-.9-7.15a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function AccountIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12.25c2.62 0 4.75-2.13 4.75-4.75S14.62 2.75 12 2.75 7.25 4.88 7.25 7.5 9.38 12.25 12 12.25Z" />
      <path d="M4.5 21.25c0-4.09 3.4-7.5 7.5-7.5s7.5 3.41 7.5 7.5H4.5Z" />
    </svg>
  )
}

function CartIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.1 6.75h15.4l-1.6 8.6a2 2 0 0 1-2 1.65H8.25a2 2 0 0 1-2-1.65L4.9 3.9H2.75V2.75h2.9c.36 0 .68.25.75.6L7 6.75Zm3.15 14.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm8 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
    </svg>
  )
}

function GalleryIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.25 5.25h15.5A1.75 1.75 0 0 1 21.5 7v10a1.75 1.75 0 0 1-1.75 1.75H4.25A1.75 1.75 0 0 1 2.5 17V7a1.75 1.75 0 0 1 1.75-1.75Zm1.5 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM4.75 16.5l3.7-4.2a.75.75 0 0 1 1.12 0l2.08 2.36 2.85-3.55a.75.75 0 0 1 1.18 0l3.87 5.39H4.75Z" />
    </svg>
  )
}

function NavItemIcon({ to }: { to: string }) {
  if (to === '/') return <HomeIcon />
  if (to.startsWith('/product')) return <GridIcon />
  if (to.startsWith('/gallery')) return <GalleryIcon />
  if (to.startsWith('/about')) return <InfoIcon />
  if (to === '/account') return <AccountIcon />
  if (to === '/cart') return <CartIcon />
  return <GridIcon />
}

interface BottomNavLinkProps {
  to: string
  label: string
  end?: boolean
  badge?: number
  theme: 'light' | 'dark'
  revealed: boolean
  onNavClick?: () => void
}

function BottomNavLink({
  to,
  label,
  end,
  badge,
  theme,
  revealed,
  onNavClick,
}: BottomNavLinkProps) {
  const isDark = theme === 'dark'

  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      onClick={() => onNavClick?.()}
      className={({ isActive }) =>
        `relative flex h-[var(--mobile-nav-box)] w-full max-w-[var(--mobile-nav-box)] min-w-0 items-center justify-center border-[2.5px] transition-[colors,background-color,transform,opacity,box-shadow] duration-450 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isActive
            ? isDark
              ? 'border-ink bg-ink text-white shadow-[3px_3px_0_#fff]'
              : 'border-ink bg-ink text-white shadow-[3px_3px_0_#fff]'
            : isDark
              ? 'border-canvas/30 bg-canvas/10 text-canvas/85 active:border-bolt active:bg-canvas/15'
              : 'border-ink/15 bg-ink/[0.06] text-ink/70 active:border-ink active:text-ink'
        }`
      }
      style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        pointerEvents: revealed ? 'auto' : 'none',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.94)',
        transition: `transform ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}, opacity ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}, colors 450ms ${STAGGER_EASE}, background-color 450ms ${STAGGER_EASE}, box-shadow 450ms ${STAGGER_EASE}`,
      }}
    >
      <NavItemIcon to={to} />
      {badge != null && badge > 0 && (
        <span
          className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[11px] font-medium text-white"
          style={{ transform: 'skewX(-10deg)' }}
        >
          <span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>
            {badge > 9 ? '9+' : badge}
          </span>
        </span>
      )}
    </NavLink>
  )
}

interface MobileBottomNavProps {
  revealed?: boolean
  revealCount?: number
  theme?: 'light' | 'dark'
  className?: string
}

export function MobileBottomNav({
  revealed = true,
  revealCount,
  theme = 'light',
  className = '',
}: MobileBottomNavProps) {
  const { t } = useI18n()
  const intro = useIntroOptional()
  const { itemCount } = useCart()

  return (
    <nav
      aria-label="Main menu"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[55] md:hidden ${className}`}
    >
      <div
        className={`pointer-events-auto border-t-[2.5px] ${
          theme === 'dark'
            ? 'border-canvas/15 bg-ink/80 backdrop-blur-md'
            : 'border-ink/10 bg-canvas/92 backdrop-blur-md'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-lg items-center justify-between gap-1.5 px-[var(--site-gutter)] pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 ${
            revealed ? '' : 'pointer-events-none'
          }`}
        >
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const itemRevealed =
            revealed && (revealCount == null || mobileNavItemIndex(item.to) < revealCount)

          return (
            <div key={item.to} className="flex min-w-0 flex-1 justify-center">
              <BottomNavLink
                to={item.to}
                end={'end' in item ? item.end : undefined}
                label={t(item.key)}
                badge={item.to === '/cart' ? itemCount : undefined}
                theme={theme}
                revealed={itemRevealed}
                onNavClick={item.to === '/' ? () => onHomeNavClick(intro) : undefined}
              />
            </div>
          )
        })}
        </div>
      </div>
    </nav>
  )
}

/** @deprecated Use MobileBottomNav */
export const MobileNavMenu = MobileBottomNav
