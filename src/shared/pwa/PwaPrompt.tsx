import { useEffect, useState } from 'react'
import { NewsletterSubscribe, hasJoinedNewsletter } from '@/features/newsletter/components/NewsletterSubscribe'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'
import {
  notificationPermission,
  notificationsSupported,
  requestShopNotifications,
} from '@/shared/pwa/notifications'

const PROMPT_KEY = 'social-things:pwa-prompt'
const LATER_MS = 3 * 24 * 60 * 60 * 1000

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function readPromptState(): 'hidden' | 'later' | 'show' {
  const raw = window.localStorage.getItem(PROMPT_KEY)
  if (raw === 'hidden') return 'hidden'
  if (raw?.startsWith('later:')) {
    const at = Number(raw.slice(6))
    if (Number.isFinite(at) && Date.now() - at < LATER_MS) return 'later'
  }
  return 'show'
}

export function PwaPrompt() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [busy, setBusy] = useState(false)
  const [listOpen] = useState(() => !hasJoinedNewsletter())

  useEffect(() => {
    setPermission(notificationPermission())
    if (readPromptState() !== 'show') return

    const timer = window.setTimeout(() => setOpen(true), 1400)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    function onInstall(event: Event) {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      if (readPromptState() === 'show') setOpen(true)
    }
    window.addEventListener('beforeinstallprompt', onInstall)
    return () => window.removeEventListener('beforeinstallprompt', onInstall)
  }, [])

  const canNotify = notificationsSupported() && permission !== 'granted' && permission !== 'unsupported'
  const canInstall = installEvent != null
  if (!open || (!canNotify && !canInstall && !listOpen)) return null

  function dismiss(mode: 'hidden' | 'later') {
    window.localStorage.setItem(PROMPT_KEY, mode === 'later' ? `later:${Date.now()}` : 'hidden')
    setOpen(false)
  }

  async function enableAlerts() {
    setBusy(true)
    const next = await requestShopNotifications()
    setPermission(next)
    setBusy(false)
    if (!canInstall) dismiss('hidden')
  }

  async function installApp() {
    if (!installEvent) return
    setBusy(true)
    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
    setBusy(false)
    if (notificationPermission() === 'granted') dismiss('hidden')
  }

  return (
    <aside
      className="pointer-events-auto fixed bottom-[calc(var(--mobile-bottom-nav-height)+0.75rem)] right-[var(--site-gutter)] z-[70] w-[min(20.5rem,calc(100vw-2rem))] md:bottom-6"
      role="dialog"
      aria-label={t('pwa.title')}
    >
      <div className="panel-cut-hard border-[3px] border-ink bg-canvas px-4 py-4 text-ink shadow-[8px_8px_0_var(--color-ink)]">
        <span className="tag-flash">
          <span>{t('pwa.tag')}</span>
        </span>
        <p className="mt-3 font-display text-sm tracking-[0.16em] uppercase">{t('pwa.title')}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t('pwa.hint')}</p>
        {listOpen && (
          <div className="mt-4">
            <p className="mb-2 font-display text-[11px] tracking-[0.18em] uppercase text-muted">
              {t('footer.newsletterTitle')}
            </p>
            <NewsletterSubscribe compact initialEmail={user?.email ?? ''} />
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {canNotify && (
            <button type="button" className="btn-slam" disabled={busy} onClick={() => void enableAlerts()}>
              <span>{busy ? t('page.account.submitting') : t('pwa.enable')}</span>
            </button>
          )}
          {canInstall && (
            <button
              type="button"
              className="btn-slam btn-slam-outline"
              disabled={busy}
              onClick={() => void installApp()}
            >
              <span>{t('pwa.install')}</span>
            </button>
          )}
        </div>
        <div className="mt-3 flex justify-between gap-3 text-[11px] tracking-[0.16em] uppercase text-muted">
          <button type="button" className="hover:text-ink" onClick={() => dismiss('later')}>
            {t('pwa.later')}
          </button>
          <button type="button" className="hover:text-ink" onClick={() => dismiss('hidden')}>
            {t('pwa.dismiss')}
          </button>
        </div>
      </div>
    </aside>
  )
}
