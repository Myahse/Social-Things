/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_CITY?: string
  readonly VITE_SITE_COUNTRY?: string
  readonly VITE_SITE_TIMEZONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}
