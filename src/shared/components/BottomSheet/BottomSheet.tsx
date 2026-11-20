import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  /** Small eyebrow above the title, e.g. "Filter". */
  eyebrow: string
  title: string
  hint?: string
  closeLabel: string
  children: ReactNode
}

/**
 * The site's bottom sheet (first written for the Gallery filter): slides up over a dimmed page, with an
 * eyebrow, title, hint and Close. Escape or a tap outside closes it; the page does not scroll behind it.
 * Rendered on <body>: page sections reveal with a transform, which would otherwise trap its
 * `position: fixed` inside the section.
 */
export function BottomSheet({ open, onClose, eyebrow, title, hint, closeLabel, children }: BottomSheetProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/55" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="anim-slam-block w-full max-w-lg border-t-[3px] border-ink bg-canvas px-[var(--site-gutter)] pt-3 shadow-[0_-10px_0_var(--color-ink)] pb-[max(1rem,calc(var(--mobile-bottom-nav-height)+0.5rem))] md:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 bg-ink" aria-hidden />
        <div className="flex items-start justify-between gap-3 text-left">
          <div>
            <p className="eyebrow-cut">{eyebrow}</p>
            <h2 id={titleId} className="mt-2 font-display text-xl tracking-[0.08em] uppercase">
              {title}
            </h2>
            {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
          </div>
          <button type="button" className="btn-slam-outline !px-3 !py-2" onClick={onClose}>
            <span>{closeLabel}</span>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
