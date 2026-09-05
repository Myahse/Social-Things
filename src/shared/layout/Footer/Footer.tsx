import { useState } from 'react'
import { subscribeNewsletter } from '@/features/newsletter/api/newsletter.api'
import { notifyNewsletterJoined } from '@/shared/pwa'
import { SlamReveal } from '@/shared/components/SlamReveal'
import { useI18n } from '@/shared/i18n/i18n'

export function Footer({ footerRef }: { footerRef?: React.RefObject<HTMLElement | null> }) {
  return (
    <footer ref={footerRef} className="relative mt-auto overflow-hidden bg-ink text-canvas">
      <div
        className="pointer-events-none absolute inset-0 diag-stripes-red anim-stripe-scroll opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 anim-shape-drift bg-bolt"
        style={{
          clipPath: 'polygon(0 18%, 100% 0, 82% 100%, 0 88%)',
          ['--p5-rot' as string]: '12deg',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-36 w-[30rem] anim-shape-drift bg-canvas"
        style={{ ['--p5-rot' as string]: '-6deg', animationDelay: '-2.2s' }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[min(36rem,78svh)] w-full max-w-6xl flex-col items-center justify-center px-[var(--site-gutter)] py-16 text-center sm:px-6 md:min-h-screen">
        <SlamReveal variant="block" className="mb-12 flex items-center justify-center gap-3">
          <SocialBox href="https://instagram.com" label="Instagram">
            <InstagramIcon />
          </SocialBox>
          <SocialBox href="https://tiktok.com" label="TikTok">
            <TikTokIcon />
          </SocialBox>
          <SocialBox href="https://x.com" label="X">
            <XIcon />
          </SocialBox>
        </SlamReveal>

        <SlamReveal variant="tag">
          <span className="tag-flash">
            <span>CALLING CARD</span>
          </span>
        </SlamReveal>
        <SlamReveal variant="block" delayMs={100} className="mt-6">
          <p className="eyebrow-cut justify-center !text-bolt">SOCIAL THINGS</p>
        </SlamReveal>
        <SlamReveal variant="title" delayMs={180} className="mt-5">
          <div className="slash-title slash-title-bolt anim-glitch-idle text-2xl sm:text-4xl lg:text-5xl">
            WELCOME TO SOCIAL THINGS
          </div>
        </SlamReveal>

        <SlamReveal variant="block" delayMs={280} className="mt-10 w-full max-w-lg">
          <NewsletterForm />
        </SlamReveal>

        <SlamReveal variant="block" delayMs={340} className="mt-8">
          <a className="btn-slam anim-pulse-ring" href="mailto:contact@socialthings.com">
            <span>CONTACT US</span>
          </a>
        </SlamReveal>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      notifyNewsletterJoined()
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="panel-cut-hard border-[3px] border-canvas bg-canvas px-4 py-5 text-left text-ink shadow-[8px_8px_0_#fff] sm:px-5 sm:py-6"
    >
      <span className="tag-flash">
        <span>{t('footer.newsletterTitle')}</span>
      </span>
      <p className="eyebrow-cut mt-4">{t('footer.newsletterHint')}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'idle' && status !== 'loading') setStatus('idle')
          }}
          placeholder={t('footer.newsletterPlaceholder')}
          className="min-h-12 flex-1 border-[3px] border-ink bg-canvas px-3 font-display text-sm tracking-[0.12em] text-ink placeholder:text-muted"
          aria-label={t('footer.newsletterPlaceholder')}
        />
        <button type="submit" className="btn-slam" disabled={status === 'loading'}>
          <span>{status === 'loading' ? t('page.account.submitting') : t('footer.newsletterSubmit')}</span>
        </button>
      </div>
      {status === 'done' && (
        <p className="mt-3 font-display text-xs tracking-[0.16em] uppercase">{t('footer.newsletterDone')}</p>
      )}
      {status === 'error' && (
        <p className="mt-3 font-display text-xs tracking-[0.16em] uppercase">{t('footer.newsletterError')}</p>
      )}
    </form>
  )
}

function SocialBox({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex h-[var(--home-side-box)] w-[var(--home-side-box)] items-center justify-center border-[3px] border-canvas bg-canvas/5 text-canvas shadow-[4px_4px_0_#fff] transition-[background,border-color,transform,box-shadow] duration-300 hover:border-bolt hover:bg-bolt hover:text-ink hover:shadow-[6px_6px_0_var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bolt p5-hover-jolt"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        transitionTimingFunction: 'var(--ease-slam)',
      }}
    >
      <span className="transition-transform duration-300 group-hover:scale-110">{children}</span>
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Zm0 1.5A3.25 3.25 0 0 0 4.25 7.5v9A3.25 3.25 0 0 0 7.5 19.75h9a3.25 3.25 0 0 0 3.25-3.25v-9A3.25 3.25 0 0 0 16.5 4.25h-9Zm4.5 3.25A4.5 4.5 0 1 1 7.5 12 4.51 4.51 0 0 1 12 7.5Zm0 1.5A3 3 0 1 0 15 12a3 3 0 0 0-3-3Zm5.35-.9a1.05 1.05 0 1 1-1.05-1.05 1.05 1.05 0 0 1 1.05 1.05Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M15.5 2.75h2.25c.2 2.4 1.55 4.1 3.5 4.6v2.4c-1.6.06-3.08-.44-4.25-1.4v7.9c0 3.2-2.6 5.75-5.8 5.75-3.15 0-5.7-2.55-5.7-5.7 0-3.2 2.6-5.8 5.9-5.8.4 0 .8.05 1.2.15v2.55a3.2 3.2 0 0 0-1.2-.25 3.25 3.25 0 0 0 0 6.5c1.8 0 3.25-1.45 3.25-3.25V2.75Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M18.8 2.75h2.45l-5.35 6.1 6.3 12.4h-4.9l-3.85-7.5-6.55 7.5H4.4l5.75-6.6-6.05-11.9h5.05l3.5 6.9 6.15-6.9Zm-.85 16.85h1.35L9.2 4.3H7.75l10.2 15.3Z" />
    </svg>
  )
}
