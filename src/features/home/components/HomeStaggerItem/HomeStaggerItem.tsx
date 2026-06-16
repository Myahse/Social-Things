import type { ReactNode } from 'react'
import { STAGGER_EASE, STAGGER_REVEAL_MS } from '@/shared/motion/stagger'

interface HomeStaggerItemProps {
  revealed: boolean
  children: ReactNode
  className?: string
}

export function HomeStaggerItem({ revealed, children, className }: HomeStaggerItemProps) {
  return (
    <div
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
        transition: `opacity ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}, transform ${STAGGER_REVEAL_MS}ms ${STAGGER_EASE}`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
