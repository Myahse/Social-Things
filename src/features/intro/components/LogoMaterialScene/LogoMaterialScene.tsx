import { Environment, Float, PresentationControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Group, PerspectiveCamera } from 'three'
import { GlbLogo } from '@/features/intro/components/LogoMaterialScene/GlbLogo'

function useResponsiveCamera() {
  const { viewport, camera } = useThree()
  const fitRadius = Math.min(viewport.width, viewport.height) * 0.5

  useEffect(() => {
    const cam = camera as PerspectiveCamera
    cam.position.z = Math.max(5.5, fitRadius * 3.4)
    cam.fov = viewport.aspect < 0.8 ? 52 : viewport.aspect > 1.4 ? 40 : 46
    cam.updateProjectionMatrix()
  }, [camera, fitRadius, viewport.aspect])

  return fitRadius
}

interface LogoMaterialSceneProps {
  onLogoDoubleClick: () => void
  interactive: boolean
  autoSpin: boolean
}

function LogoAssembly({
  onLogoDoubleClick,
  interactive,
  autoSpin,
}: LogoMaterialSceneProps) {
  const groupRef = useRef<Group>(null)
  const fitRadius = useResponsiveCamera()

  useFrame((_, delta) => {
    if (!autoSpin || !groupRef.current) return
    groupRef.current.rotation.y += delta * 0.45
  })

  return (
    <group ref={groupRef}>
      <Float
        speed={interactive ? 1.1 : 0}
        rotationIntensity={interactive ? 0.05 : 0}
        floatIntensity={interactive ? 0.12 : 0}
      >
        <GlbLogo
          fitRadius={fitRadius}
          interactive={interactive}
          onLogoDoubleClick={onLogoDoubleClick}
        />
      </Float>
    </group>
  )
}

export function LogoMaterialScene({
  onLogoDoubleClick,
  interactive,
  autoSpin,
}: LogoMaterialSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <directionalLight position={[-4, 2, 3]} intensity={0.4} />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#e8d5cf" />
      <Environment preset="city" />

      <PresentationControls
        enabled={interactive}
        global
        snap={false}
        speed={1.75}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 2.1, Math.PI / 2.1]}
        azimuth={[-Infinity, Infinity]}
      >
        <LogoAssembly
          onLogoDoubleClick={onLogoDoubleClick}
          interactive={interactive}
          autoSpin={autoSpin}
        />
      </PresentationControls>
    </>
  )
}
