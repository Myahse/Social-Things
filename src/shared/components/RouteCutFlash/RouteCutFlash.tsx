import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from '@/shared/motion/stagger'

function isHomePath(pathname: string) {
  return pathname === '/' || pathname === ''
}

/** Quick cut flash on route change — skipped on the home hero route. */
export function RouteCutFlash() {
  const { pathname } = useLocation()
  const [flashKey, setFlashKey] = useState(0)
  const [show, setShow] = useState(false)
  const skipFirst = useRef(true)

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    if (prefersReducedMotion()) return
    if (isHomePath(pathname)) return

    setFlashKey((k) => k + 1)
    setShow(true)
    const id = window.setTimeout(() => setShow(false), 420)
    return () => window.clearTimeout(id)
  }, [pathname])

  if (!show) return null

  return (
    <div
      key={flashKey}
      className="pointer-events-none fixed inset-0 z-[200]"
      aria-hidden
      style={{
        background: 'var(--color-ink)',
        animation: 'p5-flash-cut 0.42s var(--ease-cut) both',
      }}
    />
  )
}
