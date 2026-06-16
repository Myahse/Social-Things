import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useId, useRef, useState } from 'react'
import { HeroElementBg } from '@/features/home/components/HeroElementBg'
import { IntroElementBg } from '@/features/intro/components/IntroElementBg'
import { useIntroOptional } from '@/features/intro/context/IntroContext'
import { Footer } from '@/shared/layout/Footer'
import { Header } from '@/shared/layout/Header'
import socialLogoUrl from '@/assets/social logo.png'
import socialLogoBlackUrl from '@/assets/social logo-black.png'
import { useI18n } from '@/shared/i18n/i18n'
import { useSmoothScroll } from '@/shared/hooks/useSmoothScroll'
import { ScrollRail } from '@/shared/layout/ScrollRail'
import { MobileBottomNav } from '@/shared/layout/MobileNavMenu'
import { SiteLocaleInfo } from '@/shared/layout/SiteLocaleInfo'
import {
  readHomeRevealHandoff,
  useHomeRevealRouteReset,
} from '@/features/home/context/HomeRevealContext'
import { PageRevealProvider, usePageRevealOptional } from '@/shared/context/PageRevealContext'

function isHomePath(pathname: string) {
  return pathname === '/' || pathname === ''
}

function isAccountPath(pathname: string) {
  return pathname === '/account'
}

function MobileNavBar({ theme }: { theme: 'light' | 'dark' }) {
  const intro = useIntroOptional()
  const pageReveal = usePageRevealOptional()
  const staggerSides = !intro?.isPlaying && pageReveal != null

  return (
    <MobileBottomNav
      theme={theme}
      revealCount={staggerSides ? pageReveal.sideRevealCount : undefined}
    />
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const intro = useIntroOptional()
  const { lang, setLang } = useI18n()
  const [langOpen, setLangOpen] = useState(false)
  const [logoOnDark, setLogoOnDark] = useState(false)
  const popoverId = useId()
  const langWrapRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLElement | null>(null)
  const hideChrome = Boolean(intro?.isPlaying && isHomePath(pathname))
  const onHome = isHomePath(pathname)
  const pageReveal = !hideChrome
  const showFooter = !hideChrome && !isAccountPath(pathname)

  useHomeRevealRouteReset(onHome)

  // Scattered decor on inner pages; home uses a single full-viewport hero graphic instead.
  const showElementBg = !onHome
  const showHeroElementBg = onHome && !hideChrome
  const headerTransparent = showElementBg || showHeroElementBg
  const showSocialLogo = !intro?.isPlaying
  useSmoothScroll(!hideChrome)

  useEffect(() => {
    if (!langOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLangOpen(false)
    }

    function onPointerDown(e: PointerEvent) {
      const wrap = langWrapRef.current
      if (!wrap) return
      if (e.target instanceof Node && !wrap.contains(e.target)) setLangOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [langOpen])

  useEffect(() => {
    if (!showFooter) {
      setLogoOnDark(false)
      return
    }

    const el = footerRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setLogoOnDark(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.25 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [showFooter])

  const langTriggerClass = logoOnDark
    ? 'text-canvas/85 transition-colors hover:text-canvas'
    : 'text-ink/70 transition-colors hover:text-ink'

  const popoverClass = logoOnDark
    ? 'absolute bottom-[calc(100%+6px)] left-0 w-28 overflow-hidden rounded-2xl border border-canvas/20 bg-ink/70 p-1 text-sm text-canvas shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl'
    : 'absolute bottom-[calc(100%+6px)] left-0 w-28 overflow-hidden rounded-2xl border border-line/70 bg-canvas/85 p-1 text-sm text-ink shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl'

  return (
    <div className="relative flex min-h-screen flex-col">
      {showElementBg && <IntroElementBg />}
      {showHeroElementBg && <HeroElementBg />}
      {showSocialLogo && (
        <div
          ref={langWrapRef}
          className="fixed bottom-6 left-6 z-[60] hidden flex-col items-start md:flex"
        >
          <div className="relative w-32 shrink-0">
            <img
              src={socialLogoBlackUrl}
              alt=""
              draggable={false}
              className={`pointer-events-none w-32 transition-opacity duration-500 ${
                logoOnDark ? 'opacity-0' : 'opacity-90'
              }`}
            />
            <img
              src={socialLogoUrl}
              alt=""
              draggable={false}
              className={`pointer-events-none absolute inset-0 w-32 transition-opacity duration-500 ${
                logoOnDark ? 'opacity-90' : 'opacity-0'
              }`}
            />
          </div>

          <div className="relative -mt-2 pl-5">
            <button
              type="button"
              className={`text-base tracking-[0.28em] ${langTriggerClass}`}
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Change language"
              aria-haspopup="dialog"
              aria-expanded={langOpen}
              aria-controls={popoverId}
            >
              {lang === 'fr' ? 'FR' : 'US'}
            </button>

            {langOpen && (
              <div
                id={popoverId}
                role="dialog"
                aria-label="Language"
                className={popoverClass}
              >
                  <button
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-left tracking-[0.22em] transition-colors ${
                      lang === 'fr'
                        ? logoOnDark
                          ? 'bg-canvas/15 text-canvas'
                          : 'bg-ink/10 text-ink'
                        : logoOnDark
                          ? 'text-canvas/80 hover:bg-canvas/15 hover:text-canvas'
                          : 'text-ink/80 hover:bg-ink/10 hover:text-ink'
                    }`}
                    onClick={() => {
                      setLang('fr')
                      setLangOpen(false)
                    }}
                  >
                    FR
                  </button>
                  <button
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-left tracking-[0.22em] transition-colors ${
                      lang === 'en'
                        ? logoOnDark
                          ? 'bg-canvas/15 text-canvas'
                          : 'bg-ink/10 text-ink'
                        : logoOnDark
                          ? 'text-canvas/80 hover:bg-canvas/15 hover:text-canvas'
                          : 'text-ink/80 hover:bg-ink/10 hover:text-ink'
                    }`}
                    onClick={() => {
                      setLang('en')
                      setLangOpen(false)
                    }}
                  >
                    US
                  </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showSocialLogo && <SiteLocaleInfo lang={lang} onDark={logoOnDark} />}
      {!hideChrome && <ScrollRail onDark={logoOnDark} />}
      <div className="relative z-10 flex min-h-screen flex-col">
        {pageReveal ? (
          <PageRevealProvider
            routeKey={pathname}
            introHandoff={onHome && readHomeRevealHandoff()}
          >
            <Header transparent={headerTransparent} footerThemeDark={logoOnDark} />
            <MobileNavBar theme={logoOnDark ? 'dark' : 'light'} />
            <main className="flex-1 pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
              <Outlet />
            </main>
            {showFooter && <Footer footerRef={footerRef} />}
          </PageRevealProvider>
        ) : (
          <>
            {!hideChrome && <Header transparent={headerTransparent} footerThemeDark={logoOnDark} />}
            {!hideChrome && <MobileNavBar theme={logoOnDark ? 'dark' : 'light'} />}
            <main className="flex-1 pb-[calc(var(--mobile-bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
              <Outlet />
            </main>
            {showFooter && <Footer footerRef={footerRef} />}
          </>
        )}
      </div>
    </div>
  )
}
