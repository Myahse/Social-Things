import { Component, useSyncExternalStore, type ReactNode } from 'react'

/*
 * Keeps the 3D mannequin from taking the page down (ported from ArtSyde): where WebGL or WebAssembly is
 * missing (hardware acceleration off, blocklisted drivers, hardened browsers) the scene is replaced by
 * `fallback`, and a scene that still fails is caught the same way.
 */

let support: boolean | null = null

/** WebAssembly (the models are meshopt-compressed) and a WebGL context, checked once per visit. */
function can3D() {
  if (support !== null) return support
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    support = typeof WebAssembly === 'object' && Boolean(gl)
    // Hand the test context back at once: browsers cap how many can be open.
    ;(gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    support = false
  }
  return support
}

const noop = () => () => {}

/** true / false once known (null on first render): whether this device can show the 3D views. */
export function useCan3D() {
  return useSyncExternalStore(noop, can3D, () => null)
}

class Catch3D extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Renders `children` (a <Canvas>) only where 3D works, and falls back to `fallback` if the scene still fails. */
export function Safe3D({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const ok = useCan3D()
  if (ok === null) return null
  if (!ok) return fallback
  return <Catch3D fallback={fallback}>{children}</Catch3D>
}
