import { useCallback, useEffect, useState } from 'react'
import { HOME_SLIDER_IMAGES } from '@/features/home/config/home-slider-images'

const AUTO_MS = 6000
const SLIDE_MS = 800

export const HOME_HERO_ID = 'home-hero'

export function HomeHeroSlider() {
  const slides = HOME_SLIDER_IMAGES
  const [index, setIndex] = useState(0)
  const count = slides.length

  const next = useCallback(() => {
    if (count <= 1) return
    setIndex((i) => (i + 1) % count)
  }, [count])

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(next, AUTO_MS)
    return () => window.clearInterval(id)
  }, [count, next])

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
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full will-change-transform transition-transform ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transitionDuration: `${SLIDE_MS}ms`,
          }}
        >
          {slides.map((src) => (
            <div key={src} className="h-full min-w-full shrink-0">
              <img
                src={src}
                alt=""
                draggable={false}
                className="h-full w-full object-cover object-top"
              />
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
