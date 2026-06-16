import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { LogoMaterialScene } from '@/features/intro/components/LogoMaterialScene'
import type { IntroPhase } from '@/features/intro/context/IntroContext'
import logoUrl from '@/assets/logo.png'
import { HOME_HEADER_LOGO_CLASS } from '@/shared/layout/brand-cluster'

interface IntroLogoSlotProps {
  phase: IntroPhase
  onLogoDoubleClick: () => void
  compact?: boolean
  /** Header-sized logo (matches home navbar after intro). */
  home?: boolean
}

export function IntroLogoSlot({
  phase,
  onLogoDoubleClick,
  compact = false,
  home = false,
}: IntroLogoSlotProps) {
  const isHero = phase === 'hero'
  const showPng = phase !== 'hero'

  return (
    <div
      className={`pointer-events-auto relative shrink-0 ${
        compact
          ? home
            ? HOME_HEADER_LOGO_CLASS
            : 'h-[var(--brand-logo-compact)] w-[var(--brand-logo-compact)]'
          : 'h-[var(--logo-hero-size)] w-[var(--logo-hero-size)] overflow-visible'
      }`}
    >
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          compact ? 'h-full w-full' : 'h-[118%] w-[118%]'
        } ${isHero ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <Canvas
          dpr={[1, 1.5]}
          resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
          camera={{ position: [0, 0, 6], fov: 46, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          className="h-full w-full touch-none"
        >
          <Suspense fallback={null}>
            <LogoMaterialScene
              onLogoDoubleClick={onLogoDoubleClick}
              interactive={isHero}
              autoSpin={isHero}
            />
          </Suspense>
        </Canvas>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showPng ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  )
}
