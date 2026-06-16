/** Shared entrance motion — keep in sync with `HomeHeaderDesktop` side boxes. */
export const STAGGER_REVEAL_MS = 950
export const STAGGER_STEP_MS = 130
export const STAGGER_INITIAL_DELAY_MS = 240
export const STAGGER_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export const STAGGER_HIDDEN_TRANSFORM = 'translateY(12px) scale(0.985)'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
