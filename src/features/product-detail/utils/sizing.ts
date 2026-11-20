/*
 * Body chest by size (cm, common size charts) and a size advice from height and weight (ported from
 * ArtSyde). The Avatar view's mannequins widen to the chosen size's chest with the same table.
 */
export type Build = 'homme' | 'femme'

export const CHEST: Record<Build, Record<string, number>> = {
  homme: { XS: 86, S: 92, M: 98, L: 104, XL: 110, XXL: 116 },
  femme: { XS: 78, S: 82, M: 86, L: 91, XL: 97, XXL: 103 },
}

const ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/** Chest (or bust) estimated from height (cm) and weight (kg): a rough average, good to a size or so. */
export function estimateChest(build: Build, heightCm: number, weightKg: number): number {
  return build === 'homme' ? 0.55 * weightKg + 0.25 * heightCm + 15 : 0.6 * weightKg + 0.15 * heightCm + 25
}

/**
 * The size to take among `sizes` (the product's): the smallest whose body chest covers the estimate (2 cm of
 * slack), or the nearest one offered. The tees are cut oversize, so the advised size already falls loose;
 * `larger` is the next size up, for a looser look. Null when none of the product's sizes is on the chart.
 */
export function adviseSize(build: Build, heightCm: number, weightKg: number, sizes: string[]) {
  const chest = estimateChest(build, heightCm, weightKg)
  const table = CHEST[build]
  const fit = ORDER.find((s) => table[s] >= chest - 2) ?? 'XXL'
  const offered = sizes
    .map((s) => s.toUpperCase())
    .filter((s) => ORDER.includes(s))
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
  if (!offered.length) return null
  const want = ORDER.indexOf(fit)
  const distance = (s: string) => Math.abs(ORDER.indexOf(s) - want)
  const size = offered.reduce(
    (best, s) => (distance(s) < distance(best) || (distance(s) === distance(best) && ORDER.indexOf(s) > ORDER.indexOf(best)) ? s : best),
    offered[0],
  )
  const larger = offered.find((s) => ORDER.indexOf(s) > ORDER.indexOf(size)) ?? null
  return { size, larger, exact: size === fit }
}

/** Whether any of the product's sizes is on the size chart (the size helper has something to advise). */
export function hasChartSizes(sizes: string[]) {
  return sizes.some((s) => ORDER.includes(s.toUpperCase()))
}
