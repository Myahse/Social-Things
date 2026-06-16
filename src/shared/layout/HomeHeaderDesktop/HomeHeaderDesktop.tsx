import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BRAND_NAV_ITEMS, navItemIndex } from '@/shared/layout/BrandNav/nav-items'
import { STAGGER_EASE, STAGGER_REVEAL_MS } from '@/shared/motion/stagger'
import { useCart } from '@/features/cart/context/CartContext'
import { onHomeNavClick } from '@/features/intro/config/on-home-nav'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { useI18n } from '@/shared/i18n/i18n'

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeHeaderDesktopProps {
  logo: ReactNode

  sidesVisible?: boolean
  /** When set, reveals side boxes one-by-one (0..N). */
  revealCount?: number
  theme?: 'light' | 'dark'
}


export function HomeHeaderDesktop({
  logo,
  sidesVisible = true,
  revealCount,
  theme = 'light',
}: HomeHeaderDesktopProps) {
  const { t } = useI18n()
  const intro = useIntroOptional()
  const sideFade = `transition-opacity duration-500 ${EASE} ${
    sidesVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
  }`
  const [activeBox, setActiveBox] = useState<string | null>(null)

  return (
    <>
      {/* Logo stays in the header row (centered) */}
      <div className="hidden md:flex h-[var(--header-height)] items-center justify-center px-[var(--site-gutter)]">
        {logo}
      </div>

      {/* Fixed side boxes + icons */}
      <div
        className={`hidden md:flex fixed left-[var(--site-gutter)] top-1/2 z-50 -translate-y-1/2 flex-col items-start gap-2 ${sideFade}`}
      >
     
        <div onPointerLeave={() => setActiveBox(null)} className="flex flex-col gap-4">
          <nav aria-label="Main menu" className="flex flex-col items-start gap-2">
            {BRAND_NAV_ITEMS.map(({ to, key, ...rest }) => (
                <IconBoxLink
                key={to}
                to={to}
                end={'end' in rest ? rest.end : undefined}
                label={t(key)}
                activeId={activeBox}
                selfId={to}
                onActivate={() => setActiveBox(to)}
                onNavClick={to === '/' ? () => onHomeNavClick(intro) : undefined}
                theme={theme}
                revealed={
                  sidesVisible &&
                  (revealCount == null || navItemIndex(to) < revealCount)
                }
              >
                <NavItemIcon to={to} />
              </IconBoxLink>
            ))}
          </nav>

          <SideActions
            activeId={activeBox}
            onActivate={setActiveBox}
            sidesVisible={sidesVisible}
            revealCount={revealCount}
            theme={theme}
          />
        </div>
      </div>
    </>
  )
}

function AccountIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 12.25c2.62 0 4.75-2.13 4.75-4.75S14.62 2.75 12 2.75 7.25 4.88 7.25 7.5 9.38 12.25 12 12.25Z" />
      <path d="M4.5 21.25c0-4.09 3.4-7.5 7.5-7.5s7.5 3.41 7.5 7.5H4.5Z" />
    </svg>
  )
}

function CartIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.1 6.75h15.4l-1.6 8.6a2 2 0 0 1-2 1.65H8.25a2 2 0 0 1-2-1.65L4.9 3.9H2.75V2.75h2.9c.36 0 .68.25.75.6L7 6.75Zm3.15 14.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm8 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
    </svg>
  )
}

function SideBoxLink({
  to,
  label,
  icon,
  badge,
  activeId,
  onActivate,
  revealed,
  theme,
}: {
  to: string
  label: string
  icon: ReactNode
  badge?: number
  activeId: string | null
  onActivate: (id: string | null) => void
  revealed: boolean
  theme: 'light' | 'dark'
}) {
  return (
    <IconBoxLink
      to={to}
      label={label}
      badge={badge}
      activeId={activeId}
      selfId={to}
      onActivate={() => onActivate(to)}
      revealed={revealed}
      theme={theme}
    >
      {icon}
      {badge != null && badge > 0 && (
        <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </IconBoxLink>
  )
}

function SideActions({
  activeId,
  onActivate,
  sidesVisible,
  revealCount,
  theme,
}: {
  activeId: string | null
  onActivate: (id: string | null) => void
  sidesVisible: boolean
  revealCount?: number
  theme: 'light' | 'dark'
}) {
  const { itemCount } = useCart()

  return (
    <div className="flex flex-col items-start gap-2">
      <SideBoxLink
        to="/account"
        label="Account"
        icon={<AccountIcon className="h-7 w-7" />}
        activeId={activeId}
        onActivate={onActivate}
        theme={theme}
        revealed={
          sidesVisible &&
          (revealCount == null ||
            navItemIndex('/account') < revealCount)
        }
      />
      <SideBoxLink
        to="/cart"
        label="Cart"
        icon={<CartIcon className="h-7 w-7" />}
        badge={itemCount}
        activeId={activeId}
        onActivate={onActivate}
        theme={theme}
        revealed={
          sidesVisible &&
          (revealCount == null ||
            navItemIndex('/cart') < revealCount)
        }
      />
    </div>
  )
}

function HomeIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 3.25 2.75 11.1v1.4h2.4V21.25h5.35v-5.8h3v5.8h5.35V12.5h2.4v-1.4L12 3.25Z" />
    </svg>
  )
}

function GridIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.25 4.25h7.5v7.5h-7.5v-7.5Zm8.75 0h7.5v7.5H13v-7.5ZM4.25 13h7.5v7.5h-7.5V13Zm8.75 0h7.5v7.5H13V13Z" />
    </svg>
  )
}

function InfoIcon({ className = 'h-[1.125rem] w-[1.125rem]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12 21.25c5.11 0 9.25-4.14 9.25-9.25S17.11 2.75 12 2.75 2.75 6.89 2.75 12 6.89 21.25 12 21.25Zm.9-6.05a.9.9 0 1 1-1.8 0v-4.6a.9.9 0 1 1 1.8 0v4.6Zm-.9-7.15a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function NavItemIcon({ to }: { to: string }) {
  if (to === '/') return <HomeIcon className="h-7 w-7" />
  if (to.startsWith('/product')) return <GridIcon className="h-7 w-7" />
  if (to.startsWith('/about')) return <InfoIcon className="h-7 w-7" />
  return <GridIcon className="h-7 w-7" />
}

function IconBoxLink({
  to,
  label,
  badge,
  children,
  end,
  activeId,
  selfId,
  onActivate,
  onNavClick,
  revealed = true,
  theme = 'light',
}: {
  to: string
  label: string
  badge?: number
  children: ReactNode
  end?: boolean
  activeId?: string | null
  selfId?: string
  onActivate?: () => void
  onNavClick?: () => void
  revealed?: boolean
  theme?: 'light' | 'dark'
}) {
  const anyActive = Boolean(activeId)
  const isActiveHover = anyActive && activeId === selfId

  const activeIndex = anyActive ? navItemIndex(activeId ?? '') : null
  const selfIndex = navItemIndex(selfId ?? to)
  const delta = activeIndex == null ? 0 : selfIndex - activeIndex
  const abs = Math.abs(delta)
  const dir = delta === 0 ? 0 : delta > 0 ? 1 : -1


  const translateY =
    !anyActive
      ? 0
      : abs === 0
        ? -8
        : abs === 1
          ? dir * 6
          : abs === 2
            ? dir * 10
            : dir * 12

  const translateX =
    !anyActive
      ? 0
      : abs === 0
        ? 18
        : abs === 1
          ? 10
          : abs === 2
            ? 6
            : 4

  const scale =
    !anyActive
      ? 1
      : abs === 0
        ? 1.12
        : abs === 1
          ? 0.98
          : abs === 2
            ? 0.95
            : 0.93

  const opacity =
    !anyActive
      ? 1
      : abs === 0
        ? 1
        : abs === 1
          ? 0.8
          : abs === 2
            ? 0.62
            : 0.5

  const revealOpacity = revealed ? 1 : 0
  const revealTranslate = revealed ? 0 : -10
  const revealScale = revealed ? 1 : 0.94

  const isDark = theme === 'dark'

  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      onClick={() => onNavClick?.()}
      onPointerEnter={onActivate}
      onFocus={() => onActivate?.()}
      className={({ isActive }) =>
        `group relative flex h-[var(--home-side-box)] w-[var(--home-side-box)] items-center justify-center rounded-2xl will-change-transform transition-[transform,opacity,colors,background-color,filter] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          anyActive
            ? isDark
              ? `bg-canvas/20 backdrop-blur-md ${isActiveHover ? 'z-10 bg-canvas/25' : ''}`
              : `bg-canvas/95 backdrop-blur-md ${isActiveHover ? 'z-10 bg-canvas' : ''}`
            : isDark
              ? `bg-canvas/10 border border-canvas/15 ${isActiveHover ? 'z-10 bg-canvas/15' : ''} hover:bg-canvas/15`
              : `bg-ink/[0.06] ${isActiveHover ? 'z-10 bg-ink/[0.09]' : ''} hover:bg-ink/[0.09]`
        } ${
          isActive
            ? isDark
              ? 'text-canvas'
              : 'text-ink'
            : isDark
              ? 'text-canvas/85 hover:text-canvas'
              : 'text-ink/70 hover:text-ink'
        }`
      }
      style={{
        pointerEvents: revealed ? 'auto' : 'none',
        transform: `translateX(${revealTranslate + translateX}px) translateY(${translateY}px) scale(${scale * revealScale})`,
        opacity: opacity * revealOpacity,
        transition: `transform ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}, opacity ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}, colors 450ms ${STAGGER_EASE}, background-color 450ms ${STAGGER_EASE}, filter 450ms ${STAGGER_EASE}`,
      }}
    >
      {children}

      {/* Label pill (appears “in front”) */}
      <span
        className={`pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-2xl px-3 py-2 text-[12px] tracking-tight backdrop-blur-md transition-all duration-450 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? 'bg-ink/70 text-canvas' : 'bg-canvas/30 text-ink'
        } ${
          isActiveHover ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label}
      </span>

      {/* Reserve space for badge positioning when used */}
      {badge != null && badge > 0 && (
        <span className="sr-only">{badge} items</span>
      )}
    </NavLink>
  )
}
