const WELCOME_TAG = 'social-things-welcome'

export type ShopNotification = {
  title: string
  body: string
  url?: string
  tag?: string
}

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestShopNotifications(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported'
  const permission = await Notification.requestPermission()
  if (permission === 'granted') {
    await showShopNotification({
      title: 'SOCIAL THINGS',
      body: 'Alerts are on. Drops and restocks will hit this device.',
      url: '/product',
      tag: WELCOME_TAG,
    })
  }
  return permission
}

export async function showShopNotification(note: ShopNotification) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return

  const options: NotificationOptions = {
    body: note.body,
    icon: '/logo-mark.png',
    badge: '/favicon.png',
    tag: note.tag ?? 'social-things',
    data: { url: note.url ?? '/' },
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(note.title, options)
  } catch {
    new Notification(note.title, options)
  }
}

let lastCatalogAt = 0

export function notifyCatalogChange(reason: string) {
  const now = Date.now()
  if (now - lastCatalogAt < 10_000) return
  lastCatalogAt = now

  const gallery = reason.includes('gallery')
  void showShopNotification({
    title: 'SOCIAL THINGS',
    body: gallery ? 'Lookbook just updated.' : 'The drop just changed. New pieces or stock.',
    url: gallery ? '/gallery' : '/product',
    tag: 'social-things-catalog',
  })
}

export function notifyOrderConfirmed(orderId?: string) {
  void showShopNotification({
    title: 'SOCIAL THINGS',
    body: orderId ? `Order ${orderId.slice(0, 8)} is locked in.` : 'Your order is locked in.',
    url: orderId ? `/order/${orderId}` : '/',
    tag: `social-things-order-${orderId ?? 'ok'}`,
  })
}

export function notifyNewsletterJoined() {
  void showShopNotification({
    title: 'SOCIAL THINGS',
    body: 'You are on the list. Drops hit this inbox first.',
    url: '/',
    tag: 'social-things-newsletter',
  })
}
