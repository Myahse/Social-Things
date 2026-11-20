import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { useI18n } from '@/shared/i18n/i18n'
import { PRINT_H, PRINT_SIDES, PRINT_W, TEE_ASPECT, drawPrint, usePrintImages, type ProductPrints } from './print'
import { Safe3D } from './Safe3D'

/*
 * The product's t-shirt on its own in 3D (ported from ArtSyde's ProductTee3D): the fabric in the product
 * colour with its front and back prints projected across the tee's front bounding box (the same print area
 * as the mannequins). Drag to turn it.
 *
 * Model: "Oversized t-shirt" by kylelhb (https://sketchfab.com/kylelhb), CC BY 4.0 — credited in the site
 * footer; licence in public/models/tshirt-license.txt. Optimised to ~64k triangles, meshopt, WebP textures.
 */
const MODEL_URL = '/models/tshirt.glb'
/** Scene units: the tee is normalised to this height and centred on the origin. */
const TEE_HEIGHT = 2.9
const TEE_WIDTH = TEE_HEIGHT * TEE_ASPECT

type Drag = { rot: number; active: boolean }

/** The model's geometry, upright, centred and scaled; plus its fabric maps. */
function useTeeModel() {
  const { scene } = useGLTF(MODEL_URL)
  return useMemo(() => {
    scene.updateMatrixWorld(true)
    let src: THREE.Mesh | undefined
    scene.traverse((o) => {
      if (!src && (o as THREE.Mesh).isMesh) src = o as THREE.Mesh
    })
    if (!src) throw new Error('tshirt.glb has no mesh')
    const g = src.geometry.clone()
    // Positions and normals are quantised in the file: switch them to floats before baking the transforms in.
    for (const name of ['position', 'normal'] as const) {
      const a = g.getAttribute(name)
      const f = new Float32Array(a.count * 3)
      for (let i = 0; i < a.count; i++) f.set([a.getX(i), a.getY(i), a.getZ(i)], i * 3)
      g.setAttribute(name, new THREE.BufferAttribute(f, 3))
    }
    g.applyMatrix4(src.matrixWorld)
    g.computeBoundingBox()
    const c = g.boundingBox!.getCenter(new THREE.Vector3())
    g.translate(-c.x, -c.y, -c.z)
    const s = TEE_HEIGHT / (g.boundingBox!.max.y - g.boundingBox!.min.y)
    g.scale(s, s, s)
    g.computeBoundingBox()
    const m = src.material as THREE.MeshStandardMaterial
    return {
      geometry: g,
      box: g.boundingBox!.clone(),
      maps: { map: m.map, normalMap: m.normalMap, normalScale: m.normalScale.clone(), roughnessMap: m.roughnessMap },
    }
  }, [scene])
}

/** Cotton with the two print canvases projected front to back across the tee's bounding box. */
function printMaterial(box: THREE.Box3, front: THREE.Texture, back: THREE.Texture) {
  const uniforms = {
    uPrintFront: { value: front },
    uPrintBack: { value: back },
    uPrintBox: { value: new THREE.Vector4(box.min.x, box.min.y, box.max.x - box.min.x, box.max.y - box.min.y) },
  }
  const mat = new THREE.MeshPhysicalMaterial({
    roughness: 1,
    metalness: 0,
    sheen: 0.4,
    sheenRoughness: 0.85,
    envMapIntensity: 0.55,
    side: THREE.DoubleSide,
  })
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPrintPos;\nvarying vec3 vPrintNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPrintPos = position;\nvPrintNormal = normal;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vPrintPos;\nvarying vec3 vPrintNormal;\nuniform sampler2D uPrintFront;\nuniform sampler2D uPrintBack;\nuniform vec4 uPrintBox;',
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        if (gl_FrontFacing) {
          vec2 puv = (vPrintPos.xy - uPrintBox.xy) / uPrintBox.zw;
          if (vPrintNormal.z >= 0.0) {
            vec4 p = texture2D(uPrintFront, puv);
            diffuseColor.rgb = mix(diffuseColor.rgb, p.rgb, p.a);
          } else {
            vec4 p = texture2D(uPrintBack, vec2(1.0 - puv.x, puv.y));
            diffuseColor.rgb = mix(diffuseColor.rgb, p.rgb, p.a);
          }
        }`,
      )
  }
  mat.customProgramCacheKey = () => 'tee-print'
  return mat
}

const WHITE = new THREE.Color('#ffffff')
const SHEEN_FLOOR = 0.08

/** Sheen in the tee's own colour, slightly lighter (how cotton catches the light). */
function tintSheen(mat: THREE.MeshPhysicalMaterial) {
  mat.sheenColor.copy(mat.color).lerp(WHITE, 0.15)
  mat.sheenColor.r = Math.min(1, mat.sheenColor.r + SHEEN_FLOOR)
  mat.sheenColor.g = Math.min(1, mat.sheenColor.g + SHEEN_FLOOR)
  mat.sheenColor.b = Math.min(1, mat.sheenColor.b + SHEEN_FLOOR)
}

function canvasTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** A soft oval shadow under the tee: one textured plane, drawn once. */
function SoftShadow({ y, width, opacity }: { y: number; width: number; opacity: number }) {
  const texture = useMemo(() => {
    const c = Object.assign(document.createElement('canvas'), { width: 128, height: 128 })
    const x = c.getContext('2d')!
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(0.45, 'rgba(0,0,0,0.55)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[width, width * 0.42]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Tee({ color, prints, drag }: { color: string; prints: ProductPrints; drag: React.RefObject<Drag> }) {
  const { geometry, box, maps } = useTeeModel()
  const group = useRef<THREE.Group>(null)
  const images = usePrintImages(prints)

  const look = useMemo(() => {
    const canvases = {
      front: Object.assign(document.createElement('canvas'), { width: PRINT_W, height: PRINT_H }),
      back: Object.assign(document.createElement('canvas'), { width: PRINT_W, height: PRINT_H }),
    }
    const textures = { front: canvasTexture(canvases.front), back: canvasTexture(canvases.back) }
    const mat = printMaterial(box, textures.front, textures.back)
    Object.assign(mat, maps)
    return { mat, canvases, textures }
  }, [box, maps])

  useEffect(
    () => () => {
      look.mat.dispose()
      look.textures.front.dispose()
      look.textures.back.dispose()
    },
    [look],
  )

  useEffect(() => {
    try {
      look.mat.color.setStyle(color || '#ffffff')
    } catch {
      look.mat.color.set('#ffffff')
    }
    tintSheen(look.mat)
  }, [look, color])

  useEffect(() => {
    for (const side of PRINT_SIDES) {
      drawPrint(look.canvases[side], side, images[side])
      look.textures[side].needsUpdate = true
    }
  }, [look, images])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    g.rotation.y += (drag.current.rot - g.rotation.y) * (1 - Math.exp(-dt * 6))
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={look.mat} />
    </group>
  )
}

export interface Tee3DProps {
  color: string
  prints?: ProductPrints
  className?: string
}

const NO_PRINTS: ProductPrints = {}

export default function Tee3D({ color, prints = NO_PRINTS, className = '' }: Tee3DProps) {
  const { t } = useI18n()
  const drag = useRef<Drag>({ rot: 0, active: false })
  const last = useRef(0)

  return (
    <div
      className={`touch-pan-y cursor-grab select-none active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        drag.current.active = true
        last.current = e.clientX
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          // the pointer is already gone
        }
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return
        drag.current.rot += (e.clientX - last.current) * 0.01
        last.current = e.clientX
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
      role="img"
      aria-label={t('page.product.teeAria')}
    >
      <Safe3D
        fallback={
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted" role="note">
            {t('page.product.avatarUnavailable')}
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.2], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NeutralToneMapping
            gl.toneMappingExposure = 1.12
          }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <directionalLight position={[-3, 3, -5]} intensity={0.9} />
          <Environment resolution={256}>
            <Lightformer intensity={2.2} position={[0, 3, 4]} scale={[10, 3, 1]} />
            <Lightformer intensity={0.9} position={[-5, 0, 2]} scale={[3, 8, 1]} />
            <Lightformer intensity={0.9} position={[5, 0, 2]} scale={[3, 8, 1]} />
          </Environment>
          <SoftShadow y={-TEE_HEIGHT / 2 - 0.2} width={TEE_WIDTH * 1.3} opacity={0.3} />
          <Suspense fallback={null}>
            <Tee color={color} prints={prints} drag={drag} />
          </Suspense>
        </Canvas>
      </Safe3D>
    </div>
  )
}
