import { getApiBaseUrl } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'

export function catalogWsUrl(): string {
  const base = getApiBaseUrl()
  if (base.startsWith('https://')) return `${base.replace(/^https:/, 'wss:')}/ws/catalog`
  if (base.startsWith('http://')) return `${base.replace(/^http:/, 'ws:')}/ws/catalog`
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}${base}/ws/catalog`
}

export function subscribeCatalogUpdates(onChange: (reason: string) => void): () => void {
  if (!isJavaApiEnabled() || typeof WebSocket === 'undefined') {
    return () => {}
  }

  let socket: WebSocket | null = null
  let retry = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false

  function connect() {
    if (stopped) return
    socket = new WebSocket(catalogWsUrl())
    socket.onopen = () => {
      retry = 0
    }
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(String(event.data)) as { type?: string; reason?: string }
        if (
          data.type === 'catalog.changed' ||
          data.type === 'inventory.changed' ||
          data.type === 'gallery.changed'
        ) {
          onChange(data.reason || data.type)
        }
      } catch {
        onChange('updated')
      }
    }
    socket.onclose = () => {
      if (stopped) return
      const delay = Math.min(8000, 400 * 2 ** retry)
      retry += 1
      timer = setTimeout(connect, delay)
    }
  }

  connect()

  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
    socket?.close()
  }
}
