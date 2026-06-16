import type { ReactNode } from 'react'
import { useContentRevealed } from '@/shared/context/PageRevealContext'
import {
  STAGGER_EASE,
  STAGGER_HIDDEN_TRANSFORM,
  STAGGER_REVEAL_MS,
} from '@/shared/motion/stagger'

interface StaggerRevealProps {
  index: number
  children: ReactNode
  className?: string
}

export function StaggerReveal({ index, children, className }: StaggerRevealProps) {
  const revealed = useContentRevealed(index)

  return (
    <div
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0) scale(1)' : STAGGER_HIDDEN_TRANSFORM,
        transition: [
          `opacity ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}`,
          `transform ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}`,
        ].join(', '),
        willChange: revealed ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
