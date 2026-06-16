import { useCallback, useEffect, useRef, useState } from 'react'
import { IntroElementBg } from '@/features/intro/components/IntroElementBg'
import { IntroLogoSlot } from '@/features/intro/components/IntroLogoSlot'
import { clearNavArisePending } from '@/features/intro/config/intro.storage'
import { useIntro } from '@/features/intro/context/IntroContext'
import { useDesktopNav } from '@/shared/hooks/useMediaQuery'
import { STAGGER_STEP_MS } from '@/shared/motion/stagger'
import { HOME_HEADER_LOGO_CLASS } from '@/shared/layout/brand-cluster'
import { HomeHeaderDesktop } from '@/shared/layout/HomeHeaderDesktop'
import { MobileBottomNav } from '@/shared/layout/MobileNavMenu'
import { resetSiteCursor } from '@/shared/config/site-cursor'

const SHRINK_MS = 1100
const RISE_MS = 1000
const SIDES_FADE_MS = 500
const HANDOFF_MS = 400

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

interface IntroScreenProps {
  onIntroDone: () => void
}

export function IntroScreen({ onIntroDone }: IntroScreenProps) {
  const { phase, mode, ariseGeneration, setPhase, completeIntro } = useIntro()
  const isDesktopNav = useDesktopNav()
  const isRevealingRef = useRef(false)
  const doneRef = useRef(false)
  const [sidesVisible, setSidesVisible] = useState(false)
  const [revealCount, setRevealCount] = useState(0)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    resetSiteCursor()
    completeIntro()
    onIntroDone()
  }, [completeIntro, onIntroDone])

  const runAriseSequence = useCallback(() => {
    if (isRevealingRef.current) return
    isRevealingRef.current = true

    setPhase('reveal')
    window.setTimeout(() => setPhase('dock'), SHRINK_MS)
    window.setTimeout(
      () => finish(),
      SHRINK_MS + RISE_MS + SIDES_FADE_MS + HANDOFF_MS,
    )
  }, [setPhase, finish])

  const startReveal = useCallback(() => {
    if (phase !== 'hero') return
    runAriseSequence()
  }, [phase, runAriseSequence])

  useEffect(() => {
    if (mode !== 'nav-arise') return
    clearNavArisePending()
    isRevealingRef.current = false
    doneRef.current = false
    runAriseSequence()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by ariseGeneration remount
  }, [mode, ariseGeneration])

  useEffect(() => {
    if (phase !== 'dock') {
      setSidesVisible(false)
      setRevealCount(0)
      return
    }
    const start = window.setTimeout(() => {
      setSidesVisible(true)
      setRevealCount(0)
      // Reveal 1-by-1: nav items + account + cart
      const total = 5
      let i = 0
      const interval = window.setInterval(() => {
        i += 1
        setRevealCount(i)
        if (i >= total) window.clearInterval(interval)
      }, STAGGER_STEP_MS)
    }, RISE_MS)
    return () => window.clearTimeout(start)
  }, [phase])

  useEffect(() => {
    return () => {
      resetSiteCursor()
    }
  }, [])

  const isHero = phase === 'hero'
  const isShrinking = phase === 'reveal'
  const isDocked = phase === 'dock'
  const isCompact = !isHero

  const dockLogoSizeVar = isDesktopNav
    ? '--brand-logo-home'
    : '--brand-logo-compact'

  const dockBoxClass = isDesktopNav
    ? HOME_HEADER_LOGO_CLASS
    : `h-[var(${dockLogoSizeVar})] w-[var(${dockLogoSizeVar})]`

  /** Desktop: keep scaled hero box while rising; mobile swaps to compact at dock. */
  const useCompactSlot = isDocked && !isDesktopNav

  return (
    <>
      <IntroElementBg className="z-[32]" />

      <div
        className="pointer-events-none fixed inset-0 z-30 bg-canvas transition-opacity duration-700"
        style={{
          opacity: isDocked ? 0 : 1,
          transitionTimingFunction: EASE,
        }}
        aria-hidden
      />

      {/* Nav left + cart/account right (center column empty — logo floats above) */}
      {isDesktopNav && isDocked && (
        <div
          className="pointer-events-auto fixed inset-x-0 top-0 z-30"
          style={{ height: 'var(--header-height)' }}
          aria-hidden={!sidesVisible}
        >
          <HomeHeaderDesktop
            logo={<span className="sr-only" aria-hidden />}
            sidesVisible={sidesVisible}
            revealCount={revealCount}
          />
        </div>
      )}

      {/* Mobile bottom nav — same items as desktop side rail */}
      {!isDesktopNav && isDocked && (
        <MobileBottomNav revealed={sidesVisible} revealCount={revealCount} />
      )}

      {/* Logo: shrink in place, then rise to header center */}
      <div
        className="fixed z-40 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: isDocked ? 'calc(var(--header-height) / 2)' : 'var(--logo-hero-top)',
          transition: isDocked ? `top ${RISE_MS}ms ${EASE}` : 'none',
        }}
      >
        <div
          className={`relative shrink-0 overflow-visible ${
            useCompactSlot ? dockBoxClass : 'h-[var(--logo-hero-size)] w-[var(--logo-hero-size)]'
          }`}
        >
          {useCompactSlot ? (
            <IntroLogoSlot
              phase={phase}
              onLogoDoubleClick={startReveal}
              compact
              home={isDesktopNav}
            />
          ) : (
            <div
              className="origin-center will-change-transform"
              style={{
                transform: isCompact
                  ? `scale(calc(var(${dockLogoSizeVar}) / var(--logo-hero-size)))`
                  : 'scale(1)',
                transition: isShrinking
                  ? `transform ${SHRINK_MS}ms ${EASE}`
                  : 'none',
              }}
            >
              <IntroLogoSlot phase={phase} onLogoDoubleClick={startReveal} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
