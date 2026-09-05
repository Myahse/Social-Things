import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'
import { notificationPermission, requestShopNotifications } from '@/shared/pwa'

export function AccountDashboard() {
  const { t } = useI18n()
  const { user, logout } = useAuth()
  const [alerts, setAlerts] = useState(notificationPermission)

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

      {alerts !== 'unsupported' && (
        <div className="mt-8">
          {alerts === 'granted' ? (
            <p className="text-xs tracking-[0.16em] uppercase text-muted">{t('page.account.alertsOn')}</p>
          ) : (
            <>
              <p className="mb-3 text-xs tracking-[0.16em] uppercase text-muted">{t('page.account.alertsOff')}</p>
              <button
                type="button"
                className="btn-slam btn-slam-outline"
                onClick={() => {
                  void requestShopNotifications().then(setAlerts)
                }}
              >
                <span>{t('page.account.enableAlerts')}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
