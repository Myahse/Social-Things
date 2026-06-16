import { useEffect } from 'react'
import {
  readScrollMetrics,
  setSmoothScrollApi,
  type SmoothScrollApi,
} from '@/shared/scroll/smooth-scroll-api'

/** Interpolation — smooth glide between wheel steps. */
const LERP = 0.072
/** Wheel delta multiplier. */
const WHEEL_SCALE = 0.4

function maxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

/** Eased wheel scroll site-wide (no extra dependency). */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setSmoothScrollApi(null)
      return
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const listeners = new Set<() => void>()
    function notify() {
      listeners.forEach((fn) => fn())
    }

    let target = window.scrollY
    let current = window.scrollY
    let frame = 0
    let ignoreScrollSync = false

    function metrics() {
      const max = maxScrollY()
      return {
        scrollY: current,
        maxScrollY: max,
        progress: max > 0 ? current / max : 0,
      }
    }

    function clampY(y: number) {
      return Math.min(maxScrollY(), Math.max(0, y))
    }

    function syncFromNative() {
      if (ignoreScrollSync) return
      target = window.scrollY
      current = window.scrollY
      notify()
    }

    function onWheel(e: WheelEvent) {
      if (e.ctrlKey) return
      const max = maxScrollY()
      if (max <= 0) return

      e.preventDefault()
      const delta =
        e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      target = clampY(target + delta * WHEEL_SCALE)
      notify()
    }

    function tick() {
      const delta = target - current
      if (Math.abs(delta) > 0.5) {
        current += delta * LERP
        ignoreScrollSync = true
        window.scrollTo(0, current)
        notify()
        requestAnimationFrame(() => {
          ignoreScrollSync = false
        })
      } else if (Math.abs(target - current) > 0.01) {
        current = target
        ignoreScrollSync = true
        window.scrollTo(0, current)
        notify()
        requestAnimationFrame(() => {
          ignoreScrollSync = false
        })
      }
      frame = requestAnimationFrame(tick)
    }

    const api: SmoothScrollApi = {
      scrollTo: (y) => {
        const next = clampY(y)
        target = next
        current = next
        ignoreScrollSync = true
        window.scrollTo(0, next)
        notify()
        requestAnimationFrame(() => {
          ignoreScrollSync = false
        })
      },
      setTarget: (y) => {
        target = clampY(y)
        notify()
      },
      getMetrics: metrics,
      subscribe: (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
      },
    }

    if (reduced) {
      setSmoothScrollApi({
        scrollTo: (y) => {
          window.scrollTo(0, clampY(y))
          notify()
        },
        setTarget: (y) => {
          window.scrollTo(0, clampY(y))
          notify()
        },
        getMetrics: readScrollMetrics,
        subscribe: (listener) => {
          const onScroll = () => listener()
          window.addEventListener('scroll', onScroll, { passive: true })
          listener()
          return () => window.removeEventListener('scroll', onScroll)
        },
      })
      return () => setSmoothScrollApi(null)
    }

    setSmoothScrollApi(api)

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', syncFromNative, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', syncFromNative)
      setSmoothScrollApi(null)
    }
  }, [enabled])
}
