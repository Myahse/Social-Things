import { markNavArisePending } from '@/features/intro/config/intro.storage'
import type { IntroContextValue } from '@/features/intro/context/IntroContext/IntroContext'

/** Side nav / logo Home: arise animation → home content (no 3D hero). */
export function onHomeNavClick(intro: IntroContextValue | null | undefined) {
  markNavArisePending()
  intro?.playNavArise()
}
