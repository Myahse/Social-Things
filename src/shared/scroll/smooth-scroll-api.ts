export interface SmoothScrollMetrics {
  scrollY: number
  maxScrollY: number
  progress: number
}

export interface SmoothScrollApi {
  scrollTo: (y: number) => void
  setTarget: (y: number) => void
  getMetrics: () => SmoothScrollMetrics
  subscribe: (listener: () => void) => () => void
}

let activeApi: SmoothScrollApi | null = null

export function setSmoothScrollApi(api: SmoothScrollApi | null) {
  activeApi = api
}

export function getSmoothScrollApi(): SmoothScrollApi | null {
  return activeApi
}

export function readScrollMetrics(): SmoothScrollMetrics {
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const scrollY = window.scrollY
  return {
    scrollY,
    maxScrollY,
    progress: maxScrollY > 0 ? scrollY / maxScrollY : 0,
  }
}
