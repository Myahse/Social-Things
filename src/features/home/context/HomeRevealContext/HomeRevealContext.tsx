import { useEffect, useRef } from 'react'
import {
  PageRevealProvider,
  SIDE_REVEAL_COUNT,
  usePageRevealOptional,
} from '@/shared/context/PageRevealContext'

export { PageRevealProvider as HomeRevealProvider, SIDE_REVEAL_COUNT }
export const HERO_REVEAL_COUNT = 3
export const HOME_REVEAL_TOTAL = SIDE_REVEAL_COUNT + HERO_REVEAL_COUNT

export function useHomeRevealOptional() {
  return usePageRevealOptional()
}

export function useHomeReveal() {
  const ctx = usePageRevealOptional()
  if (!ctx) {
    throw new Error('useHomeReveal must be used within PageRevealProvider')
  }
  return {
    revealedCount: 0,
    sideRevealCount: ctx.sideRevealCount,
    heroRevealed: ctx.contentRevealed,
  }
}

const HANDOFF_KEY = 'social-things:home-reveal-handoff'

export function markHomeRevealHandoff() {
  try {
    sessionStorage.setItem(HANDOFF_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function readHomeRevealHandoff(): boolean {
  try {
    return sessionStorage.getItem(HANDOFF_KEY) === '1'
  } catch {
    return false
  }
}

export function clearHomeRevealHandoff() {
  try {
    sessionStorage.removeItem(HANDOFF_KEY)
  } catch {
    /* private mode */
  }
}

export function useHomeRevealRouteReset(onHome: boolean) {
  const wasHome = useRef(onHome)

  useEffect(() => {
    if (wasHome.current && !onHome) clearHomeRevealHandoff()
    wasHome.current = onHome
  }, [onHome])
}
