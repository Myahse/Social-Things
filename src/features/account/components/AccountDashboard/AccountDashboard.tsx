import { Link } from 'react-router-dom'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'

export function AccountDashboard() {
  const { t } = useI18n()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <p className="eyebrow-cut justify-center">{t('page.account.signedInAs')}</p>
      <p className="slash-title slash-title-ink mt-4 text-2xl sm:text-3xl">{user.name}</p>
      <p className="mt-4 text-sm text-muted">{user.email}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/product" className="btn-slam btn-slam-outline">
          <span>{t('page.account.browseProducts')}</span>
        </Link>
        <button type="button" onClick={() => void logout()} className="btn-slam">
          <span>{t('page.account.signOut')}</span>
        </button>
      </div>
    </div>
  )
}
