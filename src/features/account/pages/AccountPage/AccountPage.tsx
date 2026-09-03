import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AccountAuthPanel } from '@/features/account/components/AccountAuthPanel'
import { AccountDashboard } from '@/features/account/components/AccountDashboard'
import { useAuth } from '@/features/account/context/AuthContext'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

function safeNextPath(value: string | null) {
  if (!value) return null
  if (!value.startsWith('/') || value.startsWith('//')) return null
  return value
}

export function AccountPage() {
  const { t } = useI18n()
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextPath = safeNextPath(searchParams.get('next'))

  useEffect(() => {
    if (!isAuthenticated || !nextPath) return
    navigate(nextPath, { replace: true })
  }, [isAuthenticated, nextPath, navigate])
  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100dvh-var(--header-height)-var(--mobile-bottom-nav-height))] w-full max-w-6xl flex-col px-[var(--site-gutter)] py-8 sm:px-6 sm:py-10 md:min-h-[calc(100dvh-var(--header-height))]">
        <header className="shrink-0 text-center">
          <StaggerReveal index={0}>
            <span className="tag-flash mx-auto">
              <span>MEMBER</span>
            </span>
            <p className="eyebrow-cut mt-4 justify-center">SOCIAL THINGS</p>
          </StaggerReveal>
          <StaggerReveal index={1} className="mt-4">
            <h1 className="slash-title slash-title-ink text-3xl sm:text-4xl">{t('page.account.title')}</h1>
          </StaggerReveal>
          <StaggerReveal index={2} className="mt-3 text-sm tracking-[0.06em] text-muted">
            {isLoading
              ? t('page.account.loading')
              : isAuthenticated
                ? t('page.account.welcomeBack')
                : nextPath
                  ? t('page.account.signInToShop')
                  : t('page.account.guestHint')}
          </StaggerReveal>
        </header>

        <StaggerReveal index={3} className="flex flex-1 flex-col items-center justify-center py-10">
          {isLoading ? null : isAuthenticated ? <AccountDashboard /> : <AccountAuthPanel />}
        </StaggerReveal>
      </section>
    </div>
  )
}
