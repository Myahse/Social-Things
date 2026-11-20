/** Type and pill styles shared by the product page and its pieces (size helper, pickers, tabs). */
export const PRODUCT_LABEL_CLASS = 'font-display text-sm tracking-[0.18em]'
export const PRODUCT_MICRO_CLASS = 'font-display text-xs tracking-[0.16em]'

/** The page's pill buttons (sizes, view tabs, mannequin picker, size helper build). */
export const PILL_CLASS = `rounded-full border px-3 py-2 ${PRODUCT_MICRO_CLASS} transition-colors`

export function pillState(active: boolean) {
  return active ? 'border-ink bg-ink text-canvas' : 'border-line bg-canvas/70 text-ink hover:border-ink'
}
