import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'
import { notifyOrderConfirmed } from '@/shared/pwa'

export function OrderConfirmationPage() {
  const { t } = useI18n()
  const { orderId } = useParams<{ orderId: string }>()

  useEffect(() => {
    notifyOrderConfirmed(orderId)
  }, [orderId])

  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100dvh-var(--header-height)-var(--mobile-bottom-nav-height))] w-full max-w-6xl flex-col items-center justify-center px-[var(--site-gutter)] py-12 text-center sm:px-6 md:min-h-[calc(100vh-var(--header-height))]">
        <StaggerReveal index={0}>
          <span className="tag-flash">
            <span>{t('page.order.tag')}</span>
          </span>
          <p className="eyebrow-cut mt-4 justify-center">SOCIAL THINGS</p>
        </StaggerReveal>
        <StaggerReveal index={1} className="mt-5">
          <h1 className="slash-title slash-title-ink text-3xl sm:text-4xl">{t('page.order.title')}</h1>
        </StaggerReveal>
        <StaggerReveal index={2} className="mt-4 max-w-md text-sm text-muted">
          {t('page.order.hint')}
        </StaggerReveal>
        {orderId ? (
          <StaggerReveal index={3} className="mt-6 text-sm tracking-[0.18em] text-ink">
            {t('page.order.number')} {orderId}
          </StaggerReveal>
        ) : null}
        <StaggerReveal index={4} className="mt-10">
          <Link to="/product" className="btn-slam">
            <span>{t('page.cart.continue')}</span>
          </Link>
        </StaggerReveal>
      </section>
    </div>
  )
}
