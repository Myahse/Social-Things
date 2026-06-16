import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BRAND_NAV_ITEMS } from '@/shared/layout/BrandNav/nav-items'
import { onHomeNavClick } from '@/features/intro/config/on-home-nav'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { useI18n } from '@/shared/i18n/i18n'

function HamburgerToCloseIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6.35 5.3 5.3 6.35 10.95 12 5.3 17.65l1.05 1.05L12 13.05l5.65 5.65 1.05-1.05L13.05 12l5.65-5.65-1.05-1.05L12 10.95 6.35 5.3Z" />
        </>
      ) : (
        <>
          <path d="M4 6.5h16v2H4z" />
          <path d="M4 11h16v2H4z" />
          <path d="M4 15.5h16v2H4z" />
        </>
      )}
    </svg>
  )
}

const MENU_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const MENU_MS = 520

interface MobileNavMenuProps {
  /** Fade/slide in after intro (nav phase). Always visible in main header. */
  revealed?: boolean
  className?: string
}

export function MobileNavMenu({
  revealed = true,
  className = '',
}: MobileNavMenuProps) {
  const { t } = useI18n()
  const intro = useIntroOptional()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={open ? t('sheet.closeMenu') : t('sheet.openMenu')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-[opacity,colors] duration-500 hover:bg-accent-soft/60 ${
          open ? 'z-[70]' : ''
        } ${
          revealed ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } ${className}`}
      >
        <HamburgerToCloseIcon open={open} />
      </button>

      <div
        className="fixed inset-0 z-[60]"
        role="presentation"
        aria-hidden={!open}
        style={{
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label={t('sheet.closeMenu')}
          className="absolute inset-0 bg-canvas/25 backdrop-blur-2xl"
          onClick={() => setOpen(false)}
          style={{
            opacity: open ? 1 : 0,
            transition: `opacity ${MENU_MS}ms ${MENU_EASE}`,
          }}
        />

        {/* Bottom nav sheet (mobile) */}
        <aside
          className="absolute inset-x-0 bottom-0 border-t border-line/60 bg-canvas/80 backdrop-blur-2xl"
          style={{
            transform: open ? 'translateY(0)' : 'translateY(18px)',
            opacity: open ? 1 : 0,
            transition: [
              `transform ${MENU_MS}ms ${MENU_EASE}`,
              `opacity ${MENU_MS}ms ${MENU_EASE}`,
            ].join(', '),
            borderTopLeftRadius: '1.25rem',
            borderTopRightRadius: '1.25rem',
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label="Bottom navigation"
        >
          <div className="mx-auto w-full max-w-6xl px-[var(--site-gutter)] pb-6 pt-3">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line/70" aria-hidden />
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[11px] tracking-[0.28em] text-muted">SOCIAL THINGS</div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-accent-soft/60"
                onClick={() => setOpen(false)}
                aria-label={t('sheet.closeMenu')}
              >
                <HamburgerToCloseIcon open />
              </button>
            </div>

            <nav aria-label="Main menu">
              <ul className="flex flex-col gap-2">
                {BRAND_NAV_ITEMS.map(({ to, key, ...rest }, idx) => (
                  <li
                    key={to}
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? 'translateY(0)' : 'translateY(10px)',
                      transition: [
                        `opacity 460ms ${MENU_EASE}`,
                        `transform 560ms ${MENU_EASE}`,
                      ].join(', '),
                      transitionDelay: open ? `${120 + idx * 45}ms` : '0ms',
                    }}
                  >
                    <NavLink
                      to={to}
                      end={'end' in rest ? rest.end : undefined}
                      onClick={() => {
                        if (to === '/') onHomeNavClick(intro)
                        setOpen(false)
                      }}
                      className={({ isActive }) =>
                        `block rounded-xl border px-4 py-3 text-left font-display text-lg tracking-tight transition-colors ${
                          isActive
                            ? 'border-line bg-canvas text-ink'
                            : 'border-line/70 bg-canvas/60 text-ink/75 hover:bg-canvas hover:text-ink'
                        }`
                      }
                    >
                      {t(key)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </>
  )
}
