import { useState } from 'react'
import { subscribeNewsletter } from '@/features/newsletter/api/newsletter.api'
import { useI18n } from '@/shared/i18n/i18n'
import { notifyNewsletterJoined } from '@/shared/pwa/notifications'

export const NEWSLETTER_JOINED_KEY = 'social-things:newsletter-joined'

export function hasJoinedNewsletter() {
  return window.localStorage.getItem(NEWSLETTER_JOINED_KEY) === '1'
}

export function NewsletterSubscribe({
  initialEmail = '',
  compact = false,
}: {
  initialEmail?: string
  compact?: boolean
}) {
  const { t } = useI18n()
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    hasJoinedNewsletter() ? 'done' : 'idle',
  )

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      window.localStorage.setItem(NEWSLETTER_JOINED_KEY, '1')
      notifyNewsletterJoined()
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="font-display text-xs tracking-[0.16em] uppercase">{t('footer.newsletterDone')}</p>
    )
  }

  return (
    <form onSubmit={onSubmit} className={compact ? '' : 'text-left'}>
      {!compact && <p className="eyebrow-cut">{t('footer.newsletterHint')}</p>}
      <div className={`flex flex-col gap-2 ${compact ? '' : 'mt-3 sm:flex-row'}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={t('footer.newsletterPlaceholder')}
          className="min-h-11 flex-1 border-[3px] border-ink bg-canvas px-3 font-display text-sm tracking-[0.12em] text-ink placeholder:text-muted"
          aria-label={t('footer.newsletterPlaceholder')}
        />
        <button type="submit" className="btn-slam" disabled={status === 'loading'}>
          <span>{status === 'loading' ? t('page.account.submitting') : t('footer.newsletterSubmit')}</span>
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-2 font-display text-xs tracking-[0.16em] uppercase">{t('footer.newsletterError')}</p>
      )}
    </form>
  )
}
