/** Shared entrance motion — keep in sync with `HomeHeaderDesktop` side boxes. */
export const STAGGER_REVEAL_MS = 620
export const STAGGER_STEP_MS = 90
export const STAGGER_INITIAL_DELAY_MS = 120
export const STAGGER_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const STAGGER_HIDDEN_TRANSFORM = 'skewX(-16deg) translateX(-2.75rem) scale(1.12)'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
