import { useState, type FormEvent } from 'react'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'

type AuthMode = 'login' | 'register'

const fieldClass =
  'w-full rounded-2xl border border-line bg-canvas/60 px-4 py-3 text-sm text-ink backdrop-blur-md outline-none transition-colors placeholder:text-muted focus:border-ink'

export function AccountAuthPanel() {
  const { t } = useI18n()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError(t('page.account.errorRequired'))
      return
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError(t('page.account.errorRequired'))
        return
      }
      if (password.length < 6) {
        setError(t('page.account.errorPasswordShort'))
        return
      }
      if (password !== confirmPassword) {
        setError(t('page.account.errorPasswordMatch'))
        return
      }
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login({ email: email.trim(), password })
      } else {
        await register({ name: name.trim(), email: email.trim(), password })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'Invalid email or password') {
        setError(t('page.account.errorInvalidCredentials'))
      } else if (msg === 'An account with this email already exists') {
        setError(t('page.account.errorEmailTaken'))
      } else {
        setError(msg || t('page.account.errorGeneric'))
      }
      setSubmitting(false)
      return
    }
    setSubmitting(false)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex rounded-2xl border border-line bg-canvas/50 p-1 backdrop-blur-md">
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-xs tracking-[0.2em] transition-colors ${
            mode === 'login' ? 'bg-ink text-canvas' : 'text-muted hover:text-ink'
          }`}
          onClick={() => {
            setMode('login')
            setError(null)
          }}
        >
          {t('page.account.signIn')}
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl py-2.5 text-xs tracking-[0.2em] transition-colors ${
            mode === 'register' ? 'bg-ink text-canvas' : 'text-muted hover:text-ink'
          }`}
          onClick={() => {
            setMode('register')
            setError(null)
          }}
        >
          {t('page.account.register')}
        </button>
      </div>

      <p className="mb-6 text-center text-sm text-muted">
        {mode === 'login' ? t('page.account.signInHint') : t('page.account.registerHint')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.18em] text-muted">
              {t('page.account.name')}
            </span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-xs tracking-[0.18em] text-muted">
            {t('page.account.email')}
          </span>
          <input
            type="email"
            autoComplete={mode === 'login' ? 'email' : 'email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs tracking-[0.18em] text-muted">
            {t('page.account.password')}
          </span>
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>

        {mode === 'register' && (
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.18em] text-muted">
              {t('page.account.confirmPassword')}
            </span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
            />
          </label>
        )}

        {error && (
          <p className="rounded-2xl border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full border border-ink bg-ink py-3 text-sm font-medium tracking-[0.18em] text-canvas transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? t('page.account.submitting')
            : mode === 'login'
              ? t('page.account.signIn')
              : t('page.account.createAccount')}
        </button>
      </form>
    </div>
  )
}
