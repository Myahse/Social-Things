import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { IntroScreen } from '@/features/intro/components/IntroScreen'
import { isPageReload } from '@/features/intro/config/is-page-reload'
import { readNavArisePending } from '@/features/intro/config/intro.storage'
import { markHomeRevealHandoff } from '@/features/home/context/HomeRevealContext'
import { IntroProvider, useIntro } from '@/features/intro/context/IntroContext'

function isHomePath(pathname: string) {
  return pathname === '/' || pathname === ''
}

function IntroGateContent({
  children,
  onIntroComplete,
}: {
  children: ReactNode
  onIntroComplete: () => void
}) {
  const { isPlaying, ariseGeneration } = useIntro()

  useEffect(() => {
    if (!isPlaying) return

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }
  }, [isPlaying])

  if (!isPlaying) {
    return <>{children}</>
  }

  return (
    <div className="h-dvh overflow-hidden bg-canvas">
      <IntroScreen
        key={ariseGeneration}
        onIntroDone={onIntroComplete}
      />
    </div>
  )
}

interface IntroGateProps {
  children: ReactNode
}

export function IntroGate({ children }: IntroGateProps) {
  const { pathname } = useLocation()
  const onHome = isHomePath(pathname)

  if (!onHome) {
    return <>{children}</>
  }

  const navArisePending = readNavArisePending()
  const isReload = isPageReload()
  /** Navbar Home + refresh on `/`: PNG arise → home content (no 3D). */
  const useNavArise = navArisePending || isReload

  const initialPhase = useNavArise ? 'reveal' : 'hero'
  const initialMode = useNavArise ? 'nav-arise' : 'full'

  return (
    <IntroProvider initialPhase={initialPhase} initialMode={initialMode}>
      <IntroGateContent
        onIntroComplete={() => {
          markHomeRevealHandoff()
        }}
      >
        {children}
      </IntroGateContent>
    </IntroProvider>
  )
}
