import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useId, useRef, useState } from 'react'
import { RouteCutFlash } from '@/shared/components/RouteCutFlash'
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
import { HOME_HERO_ID } from '@/features/home/components/HomeHeroSlider'
import { PageRevealProvider, usePageRevealOptional } from '@/shared/context/PageRevealContext'
import {
  YOUTH_LABEL_CLASS,
  YOUTH_LABEL_WIDE_CLASS,
} from '@/shared/layout/youth-type'

function isHomePath(pathname: string) {
  return pathname === '/' || pathname === ''
}

function isAccountPath(pathname: string) {
  return pathname === '/account'
}

function isProductPath(pathname: string) {
  return pathname.startsWith('/product')
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
  const [footerInView, setFooterInView] = useState(false)
  const [heroInView, setHeroInView] = useState(() => isHomePath(pathname))
  const popoverId = useId()
  const langWrapRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLElement | null>(null)
  const hideChrome = Boolean(intro?.isPlaying && isHomePath(pathname))
  const onHome = isHomePath(pathname)
  const pageReveal = !hideChrome
  const showFooter = !hideChrome && !isAccountPath(pathname) && !isProductPath(pathname)

  useHomeRevealRouteReset(onHome)

  const showElementBg = !hideChrome
  const headerTransparent = showElementBg
  const showSocialLogo = !intro?.isPlaying
  const chromeOnDark = (onHome && heroInView) || footerInView
  useSmoothScroll(!hideChrome)

  useEffect(() => {
    if (!onHome) {
      setHeroInView(false)
      return
    }

    setHeroInView(true)

    const el = document.getElementById(HOME_HERO_ID)
    if (!el) {
      setHeroInView(false)
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setHeroInView(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.2))
      },
      { threshold: [0, 0.2, 0.35, 0.5] },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [onHome, pathname])

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
      setFooterInView(false)
      return
    }

    const el = footerRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setFooterInView(Boolean(entry?.isIntersecting))
      },
      { threshold: 0.25 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [showFooter])

  const langTriggerClass = chromeOnDark
    ? `${YOUTH_LABEL_WIDE_CLASS} text-canvas/85 transition-colors hover:text-canvas`
    : `${YOUTH_LABEL_WIDE_CLASS} text-ink/70 transition-colors hover:text-ink`

  const popoverClass = chromeOnDark
    ? `${YOUTH_LABEL_CLASS} absolute bottom-[calc(100%+6px)] left-0 w-28 overflow-hidden rounded-2xl border border-canvas/20 bg-ink/70 p-1 text-sm text-canvas shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl`
    : `${YOUTH_LABEL_CLASS} absolute bottom-[calc(100%+6px)] left-0 w-28 overflow-hidden rounded-2xl border border-line/70 bg-canvas/85 p-1 text-sm text-ink shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl`

  return (
    <div className="relative flex min-h-screen flex-col">
      <RouteCutFlash />
      {showElementBg && <IntroElementBg />}
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
                chromeOnDark ? 'opacity-0' : 'opacity-90'
              }`}
            />
            <img
              src={socialLogoUrl}
              alt=""
              draggable={false}
              className={`pointer-events-none absolute inset-0 w-32 transition-opacity duration-500 ${
                chromeOnDark ? 'opacity-90' : 'opacity-0'
              }`}
            />
          </div>

          <div className="relative -mt-2 pl-5">
            <button
              type="button"
              className={`text-base ${langTriggerClass}`}
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
                    className={`w-full rounded-xl px-3 py-2 text-left ${YOUTH_LABEL_CLASS} transition-colors ${
                      lang === 'fr'
                        ? chromeOnDark
                          ? 'bg-canvas/15 text-canvas'
                          : 'bg-ink/10 text-ink'
                        : chromeOnDark
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
                    className={`w-full rounded-xl px-3 py-2 text-left ${YOUTH_LABEL_CLASS} transition-colors ${
                      lang === 'en'
                        ? chromeOnDark
                          ? 'bg-canvas/15 text-canvas'
                          : 'bg-ink/10 text-ink'
                        : chromeOnDark
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
      {showSocialLogo && <SiteLocaleInfo lang={lang} onDark={chromeOnDark} />}
      {!hideChrome && <ScrollRail onDark={chromeOnDark} />}
      <div className="relative z-10 flex min-h-screen flex-col">
        {pageReveal ? (
          <PageRevealProvider
            routeKey={pathname}
            introHandoff={onHome && readHomeRevealHandoff()}
          >
            <Header transparent={headerTransparent} footerThemeDark={chromeOnDark} />
            <MobileNavBar theme={chromeOnDark ? 'dark' : 'light'} />
            <main className="flex-1 pb-[var(--mobile-bottom-nav-height)] md:pb-0">
              <Outlet />
            </main>
            {showFooter && <Footer footerRef={footerRef} />}
          </PageRevealProvider>
        ) : (
          <>
            {!hideChrome && <Header transparent={headerTransparent} footerThemeDark={chromeOnDark} />}
            {!hideChrome && <MobileNavBar theme={chromeOnDark ? 'dark' : 'light'} />}
            <main className="flex-1 pb-[var(--mobile-bottom-nav-height)] md:pb-0">
              <Outlet />
            </main>
            {showFooter && <Footer footerRef={footerRef} />}
          </>
        )}
      </div>
    </div>
  )
}
