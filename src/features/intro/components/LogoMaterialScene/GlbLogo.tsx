import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Box3, Sphere, SRGBColorSpace, Vector3 } from 'three'
import type { Group } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { LOGO_GLB_URL } from '@/features/intro/config/logoModel'

const CLICK_DRAG_THRESHOLD_PX = 12
const DOUBLE_CLICK_MS = 420

/** Fits the bounding sphere in view so Y-axis spin does not clip corners. */
const LOGO_SPHERE_FILL = 0.88

interface GlbLogoProps {
  fitRadius: number
  interactive: boolean
  onLogoDoubleClick: () => void
}

export function GlbLogo({ fitRadius, interactive, onLogoDoubleClick }: GlbLogoProps) {
  const { scene } = useGLTF(LOGO_GLB_URL)
  const pointerStart = useRef({ x: 0, y: 0 })
  const lastClickTime = useRef(0)
  const groupRef = useRef<Group>(null)

  const model = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((child) => {
      if ('material' in child && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((mat) => {
          if ('map' in mat && mat.map) mat.map.colorSpace = SRGBColorSpace
          if ('emissiveMap' in mat && mat.emissiveMap) mat.emissiveMap.colorSpace = SRGBColorSpace
        })
      }
    })

    const box = new Box3().setFromObject(root)
    const center = box.getCenter(new Vector3())
    const bounds = new Sphere()
    box.getBoundingSphere(bounds)
    const radius = bounds.radius || 1
    const scale = (fitRadius * LOGO_SPHERE_FILL) / radius

    root.position.sub(center)
    root.position.y -= fitRadius * 0.18
    root.scale.setScalar(scale)

    return root
  }, [scene, fitRadius])

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    if (!interactive) return
    e.stopPropagation()
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    if (!interactive) return
    e.stopPropagation()
    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    if (Math.hypot(dx, dy) >= CLICK_DRAG_THRESHOLD_PX) return

    const now = performance.now()
    if (now - lastClickTime.current < DOUBLE_CLICK_MS) {
      lastClickTime.current = 0
      onLogoDoubleClick()
      return
    }
    lastClickTime.current = now
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(LOGO_GLB_URL)
