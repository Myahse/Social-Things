import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

export function AboutPage() {
  const { t } = useI18n()
  return (
    <div className="w-full">
      <section className="diag-stripes relative mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-10 text-center sm:px-6">
        <div
          className="pointer-events-none absolute -left-12 top-24 h-32 w-56 -rotate-6 bg-ink"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-28 h-20 w-48 rotate-3 border-[3px] border-ink bg-bolt"
          aria-hidden
        />
        <StaggerReveal index={0}>
          <span className="tag-flash">
            <span>PROFILE</span>
          </span>
          <p className="eyebrow-cut mt-5 justify-center">SOCIAL THINGS</p>
        </StaggerReveal>
        <StaggerReveal index={1} className="mt-5">
          <h1 className="slash-title slash-title-ink text-3xl sm:text-5xl">{t('page.about.title')}</h1>
        </StaggerReveal>
        <StaggerReveal index={2} className="mt-6 max-w-lg text-sm tracking-[0.18em] text-muted">
          A brand built around community, craft, and the things we share.
        </StaggerReveal>
      </section>
    </div>
  )
}
