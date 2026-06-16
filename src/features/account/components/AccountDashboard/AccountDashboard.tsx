import { Link } from 'react-router-dom'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'

export function AccountDashboard() {
  const { t } = useI18n()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <p className="text-xs tracking-[0.22em] text-muted">{t('page.account.signedInAs')}</p>
      <p className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">{user.name}</p>
      <p className="mt-2 text-sm text-muted">{user.email}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/product"
          className="inline-block rounded-full border border-line bg-canvas/60 px-8 py-3 text-sm tracking-[0.16em] text-ink backdrop-blur-md transition-colors hover:border-ink"
        >
          {t('page.account.browseCatalog')}
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-block rounded-full border border-ink bg-ink px-8 py-3 text-sm font-medium tracking-[0.18em] text-canvas transition-opacity hover:opacity-90"
        >
          {t('page.account.signOut')}
        </button>
      </div>
    </div>
  )
}
