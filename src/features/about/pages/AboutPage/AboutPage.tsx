import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

export function AboutPage() {
  const { t } = useI18n()
  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-6xl flex-col items-center justify-center px-4 pb-12 pt-10 text-center sm:px-6">
        <StaggerReveal index={0}>
          <p className="text-xs tracking-[0.28em] text-muted">SOCIAL THINGS</p>
        </StaggerReveal>
        <StaggerReveal index={1} className="mt-5 font-display text-3xl tracking-tight sm:text-5xl">
          {t('page.about.title')}
        </StaggerReveal>
        <StaggerReveal index={2} className="mt-6 max-w-lg text-sm tracking-[0.18em] text-muted">
          A brand built around community, craft, and the things we share.
        </StaggerReveal>
      </section>
    </div>
  )
}
