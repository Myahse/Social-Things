import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isPageReload } from '@/features/intro/config/is-page-reload'
import {
  clearNavArisePending,
  markNavArisePending,
  readIntroDone,
  readNavArisePending,
  writeIntroDone,
} from '@/features/intro/config/intro.storage'

export type IntroPhase = 'hero' | 'reveal' | 'dock' | 'done'
export type IntroMode = 'full' | 'nav-arise'

export interface IntroContextValue {
  phase: IntroPhase
  mode: IntroMode
  ariseGeneration: number
  isPlaying: boolean
  setPhase: (phase: IntroPhase) => void
  completeIntro: () => void
  /** Navbar Home: PNG logo arise → home content (no 3D hero). */
  playNavArise: () => void
}

const IntroContext = createContext<IntroContextValue | null>(null)

function initialIntroState(
  initialPhase?: IntroPhase,
  initialMode?: IntroMode,
): { phase: IntroPhase; mode: IntroMode } {
  if (initialPhase != null && initialMode != null) {
    return { phase: initialPhase, mode: initialMode }
  }
  if (readNavArisePending() || isPageReload()) {
    return { phase: 'reveal', mode: 'nav-arise' }
  }
  if (readIntroDone()) {
    return { phase: 'done', mode: 'full' }
  }
  return { phase: 'hero', mode: 'full' }
}

export function IntroProvider({
  children,
  initialPhase,
  initialMode,
}: {
  children: ReactNode
  initialPhase?: IntroPhase
  initialMode?: IntroMode
}) {
  const [{ phase, mode }, setIntro] = useState(() =>
    initialIntroState(initialPhase, initialMode),
  )
  const [ariseGeneration, setAriseGeneration] = useState(0)

  const setPhase = useCallback((next: IntroPhase) => {
    setIntro((prev) => ({ ...prev, phase: next }))
  }, [])

  const completeIntro = useCallback(() => {
    clearNavArisePending()
    writeIntroDone()
    setIntro({ phase: 'done', mode: 'full' })
  }, [])

  const playNavArise = useCallback(() => {
    markNavArisePending()
    writeIntroDone()
    setIntro({ phase: 'reveal', mode: 'nav-arise' })
    setAriseGeneration((g) => g + 1)
  }, [])

  const value = useMemo(
    () => ({
      phase,
      mode,
      ariseGeneration,
      isPlaying: phase !== 'done',
      setPhase,
      completeIntro,
      playNavArise,
    }),
    [phase, mode, ariseGeneration, setPhase, completeIntro, playNavArise],
  )

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used within IntroProvider')
  return ctx
}

export function useIntroOptional() {
  return useContext(IntroContext)
}
