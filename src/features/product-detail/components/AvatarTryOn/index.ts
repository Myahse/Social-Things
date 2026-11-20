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
export type { WornSnapshotFn } from './AvatarTryOn'
export { useCan3D } from './Safe3D'

/** Loaded only when the Avatar view opens (three.js scene + mannequin models). */
export const AvatarTryOn = lazy(() => import('./AvatarTryOn'))

/** The product's tee on its own in 3D, loaded only when the 3D view opens. */
export const Tee3D = lazy(() => import('./Tee3D'))
