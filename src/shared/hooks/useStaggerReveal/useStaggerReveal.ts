import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, STAGGER_STEP_MS } from '@/shared/motion/stagger'

interface UseStaggerRevealOptions {
  enabled?: boolean
  delay?: number
  startCount?: number
  resetKey?: string
}

/**
 * Steps `revealedCount` from `startCount` up to `targetCount` (one step every {@link STAGGER_STEP_MS}).
 */
export function useStaggerReveal(
  targetCount: number,
  { enabled = true, delay = 240, startCount = 0, resetKey = '' }: UseStaggerRevealOptions = {},
) {
  const start = Math.min(Math.max(0, startCount), targetCount)
  const [revealedCount, setRevealedCount] = useState(() =>
    !enabled || prefersReducedMotion() ? targetCount : start,
  )
  const targetRef = useRef(targetCount)
  targetRef.current = targetCount

  useEffect(() => {
    if (!enabled) {
      setRevealedCount(targetRef.current)
      return
    }

    if (prefersReducedMotion()) {
      setRevealedCount(targetRef.current)
      return
    }

    const target = targetRef.current
    const from = Math.min(start, target)

    if (from >= target) {
      setRevealedCount(target)
      return
    }

    setRevealedCount(from)

    let interval = 0
    const timeout = window.setTimeout(() => {
      let i = from
      interval = window.setInterval(() => {
        i += 1
        setRevealedCount(i)
        if (i >= target) window.clearInterval(interval)
      }, STAGGER_STEP_MS)
    }, delay)

    return () => {
      window.clearTimeout(timeout)
      if (interval) window.clearInterval(interval)
    }
  }, [enabled, delay, start, resetKey])

  return revealedCount
}
