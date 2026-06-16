import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useStaggerReveal } from '@/shared/hooks/useStaggerReveal'
import { STAGGER_INITIAL_DELAY_MS } from '@/shared/motion/stagger'

export const SIDE_REVEAL_COUNT = 5

interface PageRevealContextValue {
  sideRevealCount: number
  contentRevealed: (index: number) => boolean
}

const PageRevealContext = createContext<PageRevealContextValue | null>(null)

function contentSlotsForRoute(pathname: string): number {
  if (pathname === '/' || pathname === '') return 3
  if (pathname === '/about') return 3
  if (pathname === '/account') return 4
  if (pathname === '/cart') return 4
  if (pathname === '/product') return 3
  if (pathname.startsWith('/product/')) return 2
  return 3
}

interface PageRevealProviderProps {
  children: ReactNode
  routeKey: string
  introHandoff?: boolean
}

export function PageRevealProvider({
  children,
  routeKey,
  introHandoff = false,
}: PageRevealProviderProps) {
  const contentSlots = contentSlotsForRoute(routeKey)
  const startCount = introHandoff ? SIDE_REVEAL_COUNT : 0
  const total = SIDE_REVEAL_COUNT + contentSlots

  const revealedCount = useStaggerReveal(total, {
    startCount,
    delay: startCount > 0 ? 0 : STAGGER_INITIAL_DELAY_MS,
    resetKey: routeKey,
  })

  const value = useMemo<PageRevealContextValue>(
    () => ({
      sideRevealCount: Math.min(revealedCount, SIDE_REVEAL_COUNT),
      contentRevealed: (index) => SIDE_REVEAL_COUNT + index < revealedCount,
    }),
    [revealedCount],
  )

  return <PageRevealContext.Provider value={value}>{children}</PageRevealContext.Provider>
}

export function usePageRevealOptional() {
  return useContext(PageRevealContext)
}

export function useContentRevealed(index: number) {
  const ctx = usePageRevealOptional()
  if (!ctx) return true
  return ctx.contentRevealed(index)
}

/** @deprecated Slot counts are derived from the route in `PageRevealProvider`. */
export function usePageRevealSlots(_slotCount: number) {
  /* no-op — avoids layout shift from late slot registration */
}
