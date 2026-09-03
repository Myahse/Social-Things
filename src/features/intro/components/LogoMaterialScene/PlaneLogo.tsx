import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import headerLogoUrl from '@/assets/logo-header.png'

const CLICK_DRAG_THRESHOLD_PX = 12
const DOUBLE_CLICK_MS = 420
const LOGO_FILL = 1.55

interface PlaneLogoProps {
  fitRadius: number
  interactive: boolean
  onLogoDoubleClick: () => void
}

function outlineTexture(source: HTMLImageElement | HTMLCanvasElement): CanvasTexture {
  const width = 'width' in source ? source.width : 1
  const height = 'height' in source ? source.height : 1
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not prepare logo texture')
  }

  ctx.drawImage(source, 0, 0)
  const pixels = ctx.getImageData(0, 0, width, height)
  const data = pixels.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const isBlack = r < 28 && g < 28 && b < 28
    if (isBlack) {
      data[i + 3] = 0
      continue
    }
    // White outline → black so it reads on the light intro canvas
    data[i] = 12
    data[i + 1] = 12
    data[i + 2] = 12
  }
  ctx.putImageData(pixels, 0, 0)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function PlaneLogo({ fitRadius, interactive, onLogoDoubleClick }: PlaneLogoProps) {
  const source = useTexture(headerLogoUrl)
  const pointerStart = useRef({ x: 0, y: 0 })
  const lastClickTime = useRef(0)

  const { map, width, height } = useMemo(() => {
    const image = source.image as HTMLImageElement | HTMLCanvasElement | undefined
    const aspect =
      image && image.width && image.height ? image.width / image.height : 2.4
    const map = image ? outlineTexture(image) : source
    const width = fitRadius * LOGO_FILL
    return { map, width, height: width / aspect }
  }, [source, fitRadius])

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
    <mesh onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} transparent alphaTest={0.08} toneMapped={false} />
    </mesh>
  )
}
