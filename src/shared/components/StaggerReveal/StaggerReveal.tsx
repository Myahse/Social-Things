import type { ReactNode } from 'react'
import { useContentRevealed } from '@/shared/context/PageRevealContext'
import { STAGGER_EASE, STAGGER_REVEAL_MS } from '@/shared/motion/stagger'

interface StaggerRevealProps {
  index: number
  children: ReactNode
  className?: string
}

/** Harder P5-style stagger: skew slam from the left instead of soft fade-up. */
export function StaggerReveal({ index, children, className }: StaggerRevealProps) {
  const revealed = useContentRevealed(index)

  return (
    <div
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed
          ? 'skewX(0deg) translateX(0) scale(1)'
          : 'skewX(-16deg) translateX(-2.75rem) scale(1.12)',
        filter: revealed ? 'none' : 'contrast(1.25) brightness(1.15)',
        transition: [
          `opacity ${STAGGER_REVEAL_MS * 0.55}ms ${STAGGER_EASE}`,
          `transform ${STAGGER_REVEAL_MS * 0.7}ms ${STAGGER_EASE}`,
          `filter ${STAGGER_REVEAL_MS * 0.55}ms ${STAGGER_EASE}`,
        ].join(', '),
        willChange: revealed ? 'auto' : 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}
