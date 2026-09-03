import { useCallback, useEffect, useRef, useState } from 'react'
import { HOME_SLIDER_SLIDES } from '@/features/home/config/home-slider-images'

const AUTO_MS = 6000
const SLIDE_MS = 800
/** Matches Tailwind `md` — desktop art from this width up. */
const DESKTOP_MQ = '(min-width: 768px)'

export const HOME_HERO_ID = 'home-hero'

export function HomeHeroSlider() {
  const slides = HOME_SLIDER_SLIDES
  const [index, setIndex] = useState(0)
  const count = slides.length

  const touchStartX = useRef<number | null>(null)

  const next = useCallback(() => {
    if (count <= 1) return
    setIndex((i) => (i + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    if (count <= 1) return
    setIndex((i) => (i - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(next, AUTO_MS)
    return () => window.clearInterval(id)
  }, [count, next, index])

  if (count === 0) {
    return (
      <section
        className="relative -mt-[var(--header-height)] h-[100svh] w-full bg-canvas"
        aria-hidden
      />
    )
  }

  return (
    <section
      id={HOME_HERO_ID}
      className="relative -mt-[var(--header-height)] h-[100svh] w-full overflow-hidden"
      aria-label="Featured looks"
    >
      <div
        className="absolute inset-0 overflow-hidden touch-pan-y"
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current
          touchStartX.current = null
          if (start == null || count <= 1) return
          const delta = (e.changedTouches[0]?.clientX ?? start) - start
          if (delta < -40) next()
          else if (delta > 40) prev()
        }}
      >
        <div
          className="flex h-full will-change-transform transition-transform ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transitionDuration: `${SLIDE_MS}ms`,
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="h-full min-w-full shrink-0">
              <picture>
                <source media={DESKTOP_MQ} srcSet={slide.desktop} />
                <img
                  src={slide.mobile}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover object-top"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-ink/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/35 to-transparent"
        aria-hidden
      />
    </section>
  )
}
