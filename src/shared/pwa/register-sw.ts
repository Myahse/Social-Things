export function registerShopServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* SW is optional in local http / older browsers */
    })
  })

  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data as { type?: string; url?: string } | undefined
    if (data?.type === 'notification-click' && data.url) {
      window.location.assign(data.url)
    }
  })
}
