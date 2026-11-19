import { lazy } from 'react'

export {
  DEFAULT_MANNEQUIN,
  MANNEQUINS,
  MANNEQUIN_GROUPS,
  firstMannequinOf,
  mannequinById,
  type MannequinGroup,
  type MannequinId,
} from './mannequins'
export type { ProductPrints } from './print'

/** Loaded only when the Avatar view opens (three.js scene + mannequin models). */
export const AvatarTryOn = lazy(() => import('./AvatarTryOn'))
