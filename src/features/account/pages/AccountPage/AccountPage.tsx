import { AccountAuthPanel } from '@/features/account/components/AccountAuthPanel'
import { AccountDashboard } from '@/features/account/components/AccountDashboard'
import { useAuth } from '@/features/account/context/AuthContext'
import { StaggerReveal } from '@/shared/components/StaggerReveal'
import { useI18n } from '@/shared/i18n/i18n'

export function AccountPage() {
  const { t } = useI18n()
  const { isAuthenticated, isLoading } = useAuth()
  return (
    <div className="w-full">
      <section className="mx-auto flex min-h-[calc(100dvh-var(--header-height))] w-full max-w-6xl flex-col px-4 py-10 sm:px-6">
        <header className="shrink-0 text-center">
          <StaggerReveal index={0}>
            <p className="text-xs tracking-[0.28em] text-muted">SOCIAL THINGS</p>
          </StaggerReveal>
          <StaggerReveal index={1} className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            {t('page.account.title')}
          </StaggerReveal>
          <StaggerReveal index={2} className="mt-3 text-sm tracking-[0.16em] text-muted">
            {isLoading
              ? t('page.account.loading')
              : isAuthenticated
                ? t('page.account.welcomeBack')
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
