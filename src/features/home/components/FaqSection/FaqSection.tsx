import { useState } from 'react'
import { PolicyDocumentLink } from '@/shared/components/PolicyDocumentLink'
import { SlamReveal } from '@/shared/components/SlamReveal'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { FAQ_ITEMS } from '@/shared/legal/faq-content'
import { useI18n } from '@/shared/i18n/i18n'

export function FaqSection() {
  const { t, lang } = useI18n()
  const items = FAQ_ITEMS[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [hitKey, setHitKey] = useState(0)

  return (
    <section
      id="faq"
      className="ink-band relative flex min-h-0 w-full flex-col justify-center overflow-hidden px-[var(--site-gutter)] py-12 sm:py-[clamp(1.25rem,4vh,2.5rem)] md:min-h-[100svh]"
    >
      <div
        className="pointer-events-none absolute -left-16 top-24 hidden h-40 w-40 anim-shape-drift bg-bolt sm:block"
        style={{
          clipPath: 'polygon(0 0, 100% 18%, 78% 100%, 0 82%)',
          ['--p5-rot' as string]: '12deg',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-28 hidden h-24 w-64 anim-shape-drift bg-bolt sm:block"
        style={{ ['--p5-rot' as string]: '-6deg', animationDelay: '-1.5s' }}
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col">
        <StaggerReveal index={0}>
          <SlamReveal variant="tag">
            <span className="tag-bolt">
              <span>SUPPORT</span>
            </span>
          </SlamReveal>
          <SlamReveal variant="block" delayMs={90} className="mt-5">
            <p className="eyebrow-cut !text-bolt">{t('page.faq.eyebrow')}</p>
          </SlamReveal>
          <SlamReveal variant="title" delayMs={160} className="mt-4">
            <h2 className="slash-title slash-title-bolt anim-glitch-idle text-3xl sm:text-4xl lg:text-5xl">
              {t('page.faq.title')}
            </h2>
          </SlamReveal>
          <SlamReveal variant="block" delayMs={240} className="mt-5 max-w-lg">
            <p className="text-sm leading-relaxed text-canvas/70 sm:text-base">
              {t('page.faq.subtitle')}
            </p>
          </SlamReveal>
        </StaggerReveal>

        <StaggerReveal index={1} className="mt-10 space-y-3">
          {items.map((item, index) => {
            const open = openIndex === index
            return (
              <SlamReveal key={item.q} variant="block" delayMs={index * 80}>
                <div
                  key={open ? `${hitKey}-open` : `${item.q}-closed`}
                  className={`overflow-hidden ${open ? 'anim-menu-hit' : ''} ${
                    open
                      ? 'speech-tail border-bolt bg-canvas text-ink shadow-[8px_8px_0_#fff]'
                      : 'border-canvas/30 bg-canvas/5 text-canvas hover:bg-canvas/10'
                  }`}
                  style={{
                    borderWidth: 3,
                    borderStyle: 'solid',
                    transform: open ? 'skewX(-4deg)' : 'skewX(0deg)',
                    transition: 'transform 220ms var(--ease-slam), box-shadow 220ms var(--ease-slam)',
                  }}
                >
                  <button
                    type="button"
                    className="flex min-h-12 w-full items-start justify-between gap-3 px-3 py-3.5 text-left font-display text-sm tracking-[0.1em] sm:gap-4 sm:px-5 sm:py-4 sm:tracking-[0.12em]"
                    style={{ transform: open ? 'skewX(4deg)' : undefined }}
                    aria-expanded={open}
                    onClick={() => {
                      setHitKey((k) => k + 1)
                      setOpenIndex(open ? null : index)
                    }}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center bg-ink px-1 text-[11px] font-medium text-white"
                        style={{ transform: 'skewX(-12deg)' }}
                        aria-hidden
                      >
                        <span style={{ transform: 'skewX(12deg)', display: 'inline-block' }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </span>
                      <span className={`p5-hover-jolt ${open ? 'text-ink' : 'text-canvas'}`}>
                        {item.q}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 font-display text-xl leading-none transition-transform duration-200 ${
                        open ? 'rotate-180 text-ink' : 'text-bolt'
                      }`}
                      aria-hidden
                    >
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <p
                      className="anim-answer-drop border-t-3 border-ink/10 px-4 pb-5 pt-3 text-sm leading-relaxed text-muted sm:px-5 sm:pl-14"
                      style={{ borderTopWidth: 3 }}
                    >
                      {item.a}
                    </p>
                  )}
                </div>
              </SlamReveal>
            )
          })}
        </StaggerReveal>

        <StaggerReveal index={2} className="mt-8 text-sm text-canvas/65">
          {t('page.faq.fullDocument')}{' '}
          <PolicyDocumentLink
            documentId="faq"
            className="text-bolt underline-offset-4 hover:underline"
          >
            {t('legal.faq')}
          </PolicyDocumentLink>
        </StaggerReveal>
      </div>
    </section>
  )
}
