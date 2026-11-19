import type { I18nKey } from '@/shared/i18n/i18n'

/*
 * The shop mannequins of the product page's Avatar view (ported from ArtSyde's "Porté" view).
 * Each one is a single dressed model in size L (oversized tee, trousers, shoes) with a mask texture
 * (red = tee, green = body): files in public/models/mannequins/{id}.glb and {id}-mask.webp.
 */

export type MannequinId =
  | 'homme-baggy'
  | 'homme-parachute'
  | 'homme-assis'
  | 'homme-cargo'
  | 'femme-baggy'
  | 'femme-cargo'
  | 'femme-assis'
  | 'duo'

export type MannequinGroup = 'homme' | 'femme' | 'duo'

/** `y`: where the floor sits in the frame (a seated mannequin is shorter, so it sits higher). */
export const MANNEQUINS: { id: MannequinId; group: MannequinGroup; look: I18nKey; y: number }[] = [
  { id: 'homme-baggy', group: 'homme', look: 'page.product.lookBaggy', y: -0.92 },
  { id: 'homme-parachute', group: 'homme', look: 'page.product.lookParachute', y: -0.92 },
  { id: 'homme-assis', group: 'homme', look: 'page.product.lookSeated', y: -0.78 },
  { id: 'homme-cargo', group: 'homme', look: 'page.product.lookCargo', y: -0.92 },
  { id: 'femme-baggy', group: 'femme', look: 'page.product.lookBaggy', y: -0.88 },
  { id: 'femme-cargo', group: 'femme', look: 'page.product.lookCargo', y: -0.88 },
  { id: 'femme-assis', group: 'femme', look: 'page.product.lookSeated', y: -0.6 },
  // a man and a woman side by side, both in the tee
  { id: 'duo', group: 'duo', look: 'page.product.lookTogether', y: -0.92 },
]

export const DEFAULT_MANNEQUIN: MannequinId = 'homme-baggy'

export const MANNEQUIN_GROUPS: { id: MannequinGroup; label: I18nKey }[] = [
  { id: 'homme', label: 'page.product.avatarMen' },
  { id: 'femme', label: 'page.product.avatarWomen' },
  { id: 'duo', label: 'page.product.avatarDuo' },
]

export function mannequinById(id: MannequinId) {
  return MANNEQUINS.find((m) => m.id === id) ?? MANNEQUINS[0]
}

export function firstMannequinOf(group: MannequinGroup): MannequinId {
  return (MANNEQUINS.find((m) => m.group === group) ?? MANNEQUINS[0]).id
}

/** Body chest by size (cm, common size charts). The models are made in L; other sizes widen or narrow them. */
export const CHEST: Record<'homme' | 'femme', Record<string, number>> = {
  homme: { XS: 86, S: 92, M: 98, L: 104, XL: 110, XXL: 116 },
  femme: { XS: 78, S: 82, M: 86, L: 91, XL: 97, XXL: 103 },
}

/** Bump when the model files change: browsers keep the old ones otherwise. */
const MODELS_V = 1
export const modelUrl = (id: MannequinId) => `/models/mannequins/${id}.glb?v=${MODELS_V}`
export const maskUrl = (id: MannequinId) => `/models/mannequins/${id}-mask.webp?v=${MODELS_V}`
