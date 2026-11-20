import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useI18n } from '@/shared/i18n/i18n'
import { CHEST, MANNEQUINS, mannequinById, maskUrl, modelUrl, type MannequinId } from './mannequins'
import { PRINT_H, PRINT_SIDES, PRINT_W, drawPrint, usePrintImages, type ProductPrints } from './print'
import { Safe3D, useCan3D } from './Safe3D'

/*
 * The product worn by a shop mannequin (ported from ArtSyde's MannequinTryOn).
 *
 * The tee and the body are found per pixel in the mannequin's mask (red = tee, green = body): the tee takes
 * the product's colour and its prints, the body a matte black. The prints use the tee's print area through
 * a second UV set baked with the model (front u 0..1, back u 2..3). Other sizes than L widen or narrow the
 * same model to that size's chest. Drag turns it; pinch, Ctrl/⌘ + wheel, double-click or the buttons zoom.
 */

const SKIN = '#1c1c1f'

const VERT_HEAD = '#include <common>\nattribute vec2 uv1;\nvarying vec2 vPU;\nvarying vec3 vPN;\nvarying vec2 vMU;'
const FRAG_HEAD =
  '#include <common>\nvarying vec2 vPU;\nvarying vec3 vPN;\nvarying vec2 vMU;\nuniform sampler2D uMask;\nuniform vec3 uTee;\nuniform vec3 uSkin;\nuniform sampler2D uPrintFront;\nuniform sampler2D uPrintBack;'
const FRAG_BODY = `#include <map_fragment>
  vec4 mk = texture2D(uMask, vMU);
  float teeM = smoothstep(0.35, 0.65, mk.r), skinM = smoothstep(0.35, 0.65, mk.g) * (1.0 - teeM);
  vec3 base = diffuseColor.rgb;
  vec3 fabric = uTee;
  bool back = vPU.x > 1.5;
  vec2 puv = vec2(back ? vPU.x - 2.0 : vPU.x, 1.0 - vPU.y);
  vec4 pr = back ? texture2D(uPrintBack, vec2(1.0 - puv.x, puv.y)) : texture2D(uPrintFront, puv);
  if (puv.x < 0.0 || puv.x > 1.0 || puv.y < 0.0 || puv.y > 1.0) pr = vec4(0.0);
  pr.a *= smoothstep(0.05, 0.3, abs(vPN.z));
  pr.a *= back ? step(vPN.z, 0.0) : step(0.0, vPN.z);
  fabric = mix(fabric, pr.rgb, pr.a);
  diffuseColor.rgb = mix(mix(base, uSkin, skinM), fabric, teeM);`

type Drag = { rot: number; active: boolean }
/** `target`: zoom asked by the gestures (the camera follows it); `focusY`: the shown mannequin's chest; pan in metres. */
type View = { target: number; focusY: number; panX: number; panY: number }

const HALF_FOV = Math.tan((30 / 2) * (Math.PI / 180))
const CAM_Y = -0.38
const CAM_Z = 5.1
const ZOOM_MAX = 2.8
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(1, z))

function canvasTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** A product colour (a CSS colour name or hex) as a THREE colour; unknown names fall back to white. */
function teeColor(color: string) {
  const c = new THREE.Color('#ffffff')
  try {
    if (color) c.setStyle(color)
  } catch {
    // keep white
  }
  return c
}

/** Starts downloading a mannequin (model + mask) so it shows at once when asked for. */
export function preloadMannequin(id: MannequinId) {
  useGLTF.preload(modelUrl(id))
  useLoader.preload(THREE.TextureLoader, maskUrl(id))
}

function Figure({
  id,
  color,
  prints,
  size,
  drag,
  onFocus,
}: {
  id: MannequinId
  color: string
  prints: ProductPrints
  size: string
  drag: React.RefObject<Drag>
  onFocus: (y: number) => void
}) {
  const { scene } = useGLTF(modelUrl(id))
  const mask = useLoader(THREE.TextureLoader, maskUrl(id))
  const images = usePrintImages(prints)
  const group = useRef<THREE.Group>(null)
  const info = mannequinById(id)

  // Once this one shows, fetch the other looks of the same group, so switching look is instant.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 1200))
    idle(() => MANNEQUINS.filter((m) => m.group === info.group && m.id !== id).forEach((m) => preloadMannequin(m.id)))
  }, [id, info.group])

  const look = useMemo(() => {
    Object.assign(mask, { flipY: false, needsUpdate: true }) // the mask follows the model's UVs, as glTF textures do
    const canvases = {
      front: Object.assign(document.createElement('canvas'), { width: PRINT_W, height: PRINT_H }),
      back: Object.assign(document.createElement('canvas'), { width: PRINT_W, height: PRINT_H }),
    }
    const textures = { front: canvasTexture(canvases.front), back: canvasTexture(canvases.back) }
    const uniforms = {
      uMask: { value: mask },
      uTee: { value: new THREE.Color() },
      uSkin: { value: new THREE.Color(SKIN) },
      uPrintFront: { value: textures.front },
      uPrintBack: { value: textures.back },
    }
    const root = scene.clone(true)
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const old = mesh.material as THREE.MeshStandardMaterial
      // smooth shading across the model's texture seams (the low-poly export shades flat otherwise)
      mesh.geometry = toCreasedNormals(mesh.geometry, Math.PI / 2.2)
      const mat = new THREE.MeshPhysicalMaterial({
        map: old.map,
        roughness: 0.85,
        metalness: 0,
        sheen: 0.4,
        sheenRoughness: 0.85,
        envMapIntensity: 0.55,
      })
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, uniforms)
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', VERT_HEAD)
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPU = uv1;\nvPN = normal;\nvMU = uv;')
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', FRAG_HEAD)
          .replace('#include <map_fragment>', FRAG_BODY)
      }
      mat.customProgramCacheKey = () => 'mannequin'
      mesh.material = mat
    })
    return { root, canvases, textures, uniforms }
  }, [scene, mask])

  useEffect(
    () => () => {
      look.textures.front.dispose()
      look.textures.back.dispose()
    },
    [look],
  )

  // Where the zoom aims: the chest, a little under the top of the head.
  useEffect(() => {
    const top = new THREE.Box3().setFromObject(look.root).max.y
    onFocus(info.y + top - 0.45)
  }, [look, info.y, onFocus])

  useEffect(() => {
    look.uniforms.uTee.value.copy(teeColor(color))
  }, [look, color])

  useEffect(() => {
    for (const side of PRINT_SIDES) {
      drawPrint(look.canvases[side], side, images[side])
      look.textures[side].needsUpdate = true // re-upload the redrawn canvas
    }
  }, [look, images])

  const build = info.group === 'femme' ? 'femme' : 'homme' // the duo widens like the men's sizes
  const k = (CHEST[build][size] ?? CHEST[build].L) / CHEST[build].L

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    g.rotation.y += (drag.current.rot - g.rotation.y) * (1 - Math.exp(-dt * 6))
    g.scale.x += (k - g.scale.x) * (1 - Math.exp(-dt * 8))
    g.scale.z = g.scale.x
  })

  return (
    <group ref={group} name="mannequin-pose" position={[0, info.y, 0]}>
      <primitive object={look.root} />
    </group>
  )
}

/** Renders the mannequin front-on or back-on, unzoomed, at `width` px, on a transparent background. */
export type WornSnapshotFn = (width: number, face: 'front' | 'back') => Promise<Blob | null>

/** Registers the snapshot on `target` (the share card's renders); pose and camera are put back after. */
function WornSnapshot({ target }: { target: React.RefObject<WornSnapshotFn | null> }) {
  const get = useThree((st) => st.get)
  useEffect(() => {
    target.current = (width, face) => {
      const { gl, scene, camera, size } = get()
      const pose = scene.getObjectByName('mannequin-pose')
      const rot = pose?.rotation.y ?? 0
      const cam = camera.position.clone()
      if (pose) pose.rotation.y = face === 'back' ? Math.PI : 0
      camera.position.set(0, CAM_Y, CAM_Z)
      const max = gl.capabilities.maxTextureSize
      const scale = Math.min(1, max / Math.max(width, (width * size.height) / size.width))
      const w = Math.round(width * scale)
      const h = Math.round(((width * size.height) / size.width) * scale)
      const ratio = gl.getPixelRatio()
      gl.setPixelRatio(1)
      gl.setSize(w, h, false)
      gl.render(scene, camera)
      if (pose) pose.rotation.y = rot
      camera.position.copy(cam)
      return new Promise<Blob | null>((resolve) => {
        gl.domElement.toBlob(resolve, 'image/png') // the pixels are captured now, encoded afterwards
        gl.setPixelRatio(ratio)
        gl.setSize(size.width, size.height, false)
        gl.render(scene, camera)
      })
    }
    return () => {
      target.current = null
    }
  }, [get, target])
  return null
}

/** Moves the camera with the zoom: closer, and up to the chest, looking straight ahead. */
function CameraRig({ view }: { view: React.RefObject<View> }) {
  const camera = useThree((st) => st.camera)
  const cur = useRef({ zoom: 1, x: 0, y: 0 })
  useFrame((_, dt) => {
    const v = view.current
    const c = cur.current
    const k = 1 - Math.exp(-dt * 10)
    c.zoom += (v.target - c.zoom) * k
    c.x += (v.panX - c.x) * k
    c.y += (v.panY - c.y) * k
    const t = (c.zoom - 1) / (ZOOM_MAX - 1)
    camera.position.set(c.x, CAM_Y + (v.focusY - CAM_Y) * t + c.y, CAM_Z / c.zoom)
  })
  return null
}

export interface AvatarTryOnProps {
  mannequin: MannequinId
  /** The product colour (CSS colour name or hex). */
  color: string
  prints?: ProductPrints
  /** The size chosen on the page (the mannequin widens to that size's chest); empty means L. */
  size: string
  className?: string
  /** Filled with a snapshot function once the scene is ready (used by "Share this look"). */
  snapshotRef?: React.RefObject<WornSnapshotFn | null>
}

const NO_PRINTS: ProductPrints = {}

export default function AvatarTryOn({
  mannequin,
  color,
  prints = NO_PRINTS,
  size,
  className = '',
  snapshotRef,
}: AvatarTryOnProps) {
  const { t } = useI18n()
  const can3D = useCan3D()
  const drag = useRef<Drag>({ rot: 0.35, active: false })
  const last = useRef(0)
  const view = useRef<View>({ target: 1, focusY: 0.4, panX: 0, panY: 0 })
  const [zoomed, setZoomed] = useState(false)

  // Moving the zoomed view: kept so the mannequin never leaves the frame.
  const panBy = useCallback((dx: number, dy: number, height: number) => {
    const v = view.current
    const perPx = (2 * (CAM_Z / v.target) * HALF_FOV) / Math.max(1, height)
    v.panX = Math.min(0.7, Math.max(-0.7, v.panX - dx * perPx))
    v.panY = Math.min(0.6, Math.max(-1.2, v.panY + dy * perPx))
  }, [])
  const zoomTo = useCallback((z: number) => {
    const v = view.current
    v.target = clampZoom(z)
    if (v.target <= 1.05) Object.assign(v, { target: 1, panX: 0, panY: 0 })
    setZoomed(v.target > 1.05)
  }, [])
  const onFocus = useCallback((y: number) => {
    view.current.focusY = y
  }, [])

  // Two fingers: pinch to zoom (one finger still turns it).
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; zoom: number; mid: { x: number; y: number } } | null>(null)
  const spread = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }
  const middle = () => {
    const [a, b] = [...pointers.current.values()]
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  }
  // While zoomed, a drag also moves the view up and down (Shift + drag moves it any way, without turning).
  const panFrom = useRef<{ x: number; y: number; free: boolean } | null>(null)

  // Trackpad pinch (or Ctrl/⌘ + wheel) zooms; a plain wheel still scrolls the page.
  const area = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = area.current
    if (!el) return
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      zoomTo(view.current.target * Math.exp(-e.deltaY * 0.01))
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
  }, [zoomTo])

  const fallback = (
    <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted" role="note">
      {t('page.product.avatarUnavailable')}
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      <div
        ref={area}
        className={`h-full w-full select-none ${zoomed ? 'touch-none cursor-move' : 'touch-pan-y cursor-grab active:cursor-grabbing'}`}
        onPointerDown={(e) => {
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
          try {
            e.currentTarget.setPointerCapture(e.pointerId) // keep the moves even if the finger leaves the area
          } catch {
            // the pointer is already gone (a very quick tap)
          }
          if (pointers.current.size === 2) {
            pinch.current = { dist: spread(), zoom: view.current.target, mid: middle() }
            drag.current.active = false
            panFrom.current = null
            return
          }
          if (view.current.target > 1.05) {
            panFrom.current = { x: e.clientX, y: e.clientY, free: e.shiftKey }
            if (e.shiftKey) return
          }
          drag.current.active = true
          last.current = e.clientX
        }}
        onPointerMove={(e) => {
          if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
          const h = e.currentTarget.clientHeight
          if (pinch.current && pointers.current.size === 2) {
            zoomTo((pinch.current.zoom * spread()) / Math.max(1, pinch.current.dist))
            const m = middle()
            panBy(m.x - pinch.current.mid.x, m.y - pinch.current.mid.y, h)
            pinch.current.mid = m
            return
          }
          if (panFrom.current) {
            const { x, y, free } = panFrom.current
            panBy(free ? e.clientX - x : 0, e.clientY - y, h)
            panFrom.current = { x: e.clientX, y: e.clientY, free }
            if (free) return
          }
          if (!drag.current.active) return
          drag.current.rot += (e.clientX - last.current) * 0.01
          last.current = e.clientX
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId)
          if (pointers.current.size < 2) pinch.current = null
          panFrom.current = null
          drag.current.active = false
        }}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId)
          pinch.current = null
          panFrom.current = null
          drag.current.active = false
        }}
        onDoubleClick={() => zoomTo(view.current.target > 1.05 ? 1 : 2.2)}
        role="img"
        aria-label={`${t('page.product.avatarAria')} ${t('page.product.size')} ${size || 'L'}.`}
      >
        <Safe3D fallback={fallback}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, CAM_Y, CAM_Z], fov: 30 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: Boolean(snapshotRef) }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.NeutralToneMapping
              gl.toneMappingExposure = 1.12 // the fabric's lit side lands on the chosen colour, folds stay darker
            }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight position={[2.5, 4, 4]} intensity={1.6} />
            <directionalLight position={[-3, 2, 2]} intensity={0.5} />
            <directionalLight position={[0, 3, -4]} intensity={0.9} />
            <Environment resolution={256}>
              <Lightformer intensity={2} position={[0, 3, 4]} scale={[10, 3, 1]} />
              <Lightformer intensity={0.8} position={[-5, 0, 2]} scale={[3, 8, 1]} />
              <Lightformer intensity={0.8} position={[5, 0, 2]} scale={[3, 8, 1]} />
            </Environment>
            <CameraRig view={view} />
            {snapshotRef && <WornSnapshot target={snapshotRef} />}
            <Suspense fallback={null}>
              <Figure key={mannequin} id={mannequin} color={color} prints={prints} size={size} drag={drag} onFocus={onFocus} />
            </Suspense>
          </Canvas>
        </Safe3D>
      </div>

      {/* Zoom buttons (pinch, trackpad pinch and double-click also zoom); not shown where 3D can't run. */}
      {can3D && (
      <div className="absolute right-2 top-2 grid gap-1.5">
        {(
          [
            ['+', 'page.product.zoomIn', 1.5],
            ['−', 'page.product.zoomOut', 1 / 1.5],
          ] as const
        ).map(([sign, label, k]) => (
          <button
            key={sign}
            type="button"
            onClick={() => zoomTo(view.current.target * k)}
            disabled={sign === '−' && !zoomed}
            aria-label={t(label)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas/70 text-lg leading-none text-ink backdrop-blur-md transition-opacity disabled:opacity-35"
          >
            {sign}
          </button>
        ))}
      </div>
      )}
    </div>
  )
}
