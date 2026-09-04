import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { SRGBColorSpace } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import logoUrl from '@/assets/logo.png'

const CLICK_DRAG_THRESHOLD_PX = 10

interface PlaneLogoProps {
  width: number
  height: number
  onLogoClick: () => void
}

export function PlaneLogo({ width, height, onLogoClick }: PlaneLogoProps) {
  const logoMap = useTexture(logoUrl, (texture) => {
    texture.colorSpace = SRGBColorSpace
    texture.needsUpdate = true
  })
  const pointerStart = useRef({ x: 0, y: 0 })

  const material = useMemo(
    () => ({
      map: logoMap,
      transparent: true,
      alphaTest: 0.06,
      toneMapped: false,
    }),
    [logoMap],
  )

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    if (Math.hypot(dx, dy) < CLICK_DRAG_THRESHOLD_PX) {
      onLogoClick()
    }
  }

  return (
    <mesh
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial {...material} />
    </mesh>
  )
}
