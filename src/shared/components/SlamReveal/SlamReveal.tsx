import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/shared/motion/stagger'

interface SlamRevealProps {
  children: ReactNode
  className?: string
  /** Delay after entering view (ms) */
  delayMs?: number
  /** slam-title | slam-block | tag-pop */
  variant?: 'title' | 'block' | 'tag'
  style?: CSSProperties
  /** Replay slam when re-entering viewport */
  once?: boolean
}

const VARIANT_CLASS = {
  title: 'anim-slam-title',
  block: 'anim-slam-block',
  tag: 'anim-tag-pop',
} as const

/** Aggressive P5 entrance when scrolled into view. */
export function SlamReveal({
  children,
  className = '',
  delayMs = 0,
  variant = 'block',
  style,
  once = true,
}: SlamRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setActive(true)
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting && entry.intersectionRatio > 0.18) {
          window.setTimeout(() => setActive(true), delayMs)
          if (once) obs.disconnect()
        } else if (!once) {
          setActive(false)
        }
      },
      { threshold: [0, 0.18, 0.35] },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delayMs, once])

  return (
    <div
      ref={ref}
      className={`${className} ${active ? VARIANT_CLASS[variant] : 'opacity-0'}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
