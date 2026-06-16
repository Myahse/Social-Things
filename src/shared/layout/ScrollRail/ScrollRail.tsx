import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSmoothScrollApi,
  readScrollMetrics,
  type SmoothScrollMetrics,
} from '@/shared/scroll/smooth-scroll-api'

/** Diameter of the filled circle indicator (px). */
const INDICATOR_SIZE = 8
/** Vertical inset from header / footer (shortens the track). */
const RAIL_TOP_OFFSET = '2.5rem'
const RAIL_BOTTOM_OFFSET = '11rem'
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

interface ScrollRailProps {
  onDark?: boolean
}

export function ScrollRail({ onDark = false }: ScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef(false)
  const [metrics, setMetrics] = useState<SmoothScrollMetrics>(() => readScrollMetrics())

  const sync = useCallback(() => {
    const api = getSmoothScrollApi()
    setMetrics(api ? api.getMetrics() : readScrollMetrics())
  }, [])

  useEffect(() => {
    sync()
    const api = getSmoothScrollApi()
    if (api) return api.subscribe(sync)

    const onScroll = () => sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync)
    const ro = new ResizeObserver(sync)
    ro.observe(document.documentElement)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      ro.disconnect()
    }
  }, [sync])

  const scrollToProgress = useCallback((progress: number) => {
    const api = getSmoothScrollApi()
    const { maxScrollY } = readScrollMetrics()
    const y = Math.min(maxScrollY, Math.max(0, progress * maxScrollY))
    if (api) api.scrollTo(y)
    else window.scrollTo(0, y)
  }, [])

  const pointerToProgress = useCallback((clientY: number) => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const usable = Math.max(1, rect.height - INDICATOR_SIZE)
    const y = clientY - rect.top - INDICATOR_SIZE / 2
    return Math.min(1, Math.max(0, y / usable))
  }, [])

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!dragRef.current) return
      scrollToProgress(pointerToProgress(e.clientY))
    }

    function onPointerUp() {
      dragRef.current = false
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [pointerToProgress, scrollToProgress])

  if (metrics.maxScrollY <= 8) return null

  const trackClass = onDark ? 'bg-canvas/25' : 'bg-ink/15'
  const indicatorClass = onDark
    ? 'bg-canvas/90 hover:bg-canvas'
    : 'bg-ink/55 hover:bg-ink/80'

  const indicatorTop =
    metrics.maxScrollY > 0
      ? `calc(${metrics.progress * 100}% - ${metrics.progress * INDICATOR_SIZE}px)`
      : '0px'

  return (
    <div
      className="pointer-events-none fixed right-6 z-[55] hidden w-6 md:block"
      style={{
        top: `calc(var(--header-height) + ${RAIL_TOP_OFFSET})`,
        height: `calc(100dvh - var(--header-height) - ${RAIL_TOP_OFFSET} - ${RAIL_BOTTOM_OFFSET})`,
      }}
      aria-hidden
    >
      <div
        ref={trackRef}
        role="scrollbar"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(metrics.progress * 100)}
        aria-label="Page scroll"
        className="pointer-events-auto relative mx-auto h-full w-6 cursor-pointer"
        onPointerDown={(e) => {
          if (e.button !== 0) return
          const target = e.target as HTMLElement
          if (target.dataset.scrollIndicator === 'true') return
          scrollToProgress(pointerToProgress(e.clientY))
        }}
      >
        {/* Full-height track line */}
        <div
          className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 transition-colors duration-500 ${trackClass}`}
          style={{ transitionTimingFunction: EASE }}
          aria-hidden
        />

        {/* Moving indicator — filled circle */}
        <div
          data-scroll-indicator="true"
          className={`absolute left-1/2 -translate-x-1/2 cursor-grab rounded-full transition-colors duration-500 active:cursor-grabbing ${indicatorClass}`}
          style={{
            top: indicatorTop,
            width: INDICATOR_SIZE,
            height: INDICATOR_SIZE,
            transitionTimingFunction: EASE,
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            dragRef.current = true
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          }}
        />
      </div>
    </div>
  )
}
