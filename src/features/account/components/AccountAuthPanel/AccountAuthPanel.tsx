import { useMemo, useState, type FormEvent } from 'react'
import { RegisterPolicyConsents } from '@/features/account/components/RegisterPolicyConsents'
import { useAuth } from '@/features/account/context/AuthContext'
import { useI18n } from '@/shared/i18n/i18n'
import {
  REGISTRATION_CONSENT_POLICIES,
  type PolicyDocumentId,
} from '@/shared/legal/policy-documents'

type AuthMode = 'login' | 'register'

const fieldClass =
  'w-full border-[3px] border-ink bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus:shadow-[4px_4px_0_var(--color-ink)]'

const labelClass = 'font-display text-xs tracking-[0.18em]'
const tabClass = 'font-display text-xs tracking-[0.2em]'

function emptyConsents(): Partial<Record<PolicyDocumentId, boolean>> {
  return Object.fromEntries(REGISTRATION_CONSENT_POLICIES.map((doc) => [doc.id, false]))
}

function allConsentsAccepted(accepted: Partial<Record<PolicyDocumentId, boolean>>): boolean {
  return REGISTRATION_CONSENT_POLICIES.every((doc) => accepted[doc.id])
}

export function AccountAuthPanel() {
  const { t } = useI18n()
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedPolicies, setAcceptedPolicies] = useState(emptyConsents)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const policiesComplete = useMemo(() => allConsentsAccepted(acceptedPolicies), [acceptedPolicies])

  function switchMode(next: AuthMode) {
    setMode(next)
    setError(null)
    setAcceptedPolicies(emptyConsents())
  }

  function handlePolicyChange(id: PolicyDocumentId, checked: boolean) {
    setAcceptedPolicies((prev) => ({ ...prev, [id]: checked }))
  }

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
      if (!policiesComplete) {
        setError(t('page.account.errorPoliciesRequired'))
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
      <div className="mb-8 flex border-[3px] border-ink bg-canvas p-1 shadow-[5px_5px_0_var(--color-ink)]">
        <button
          type="button"
          className={`flex-1 py-2.5 ${tabClass} transition-colors ${
            mode === 'login' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
          style={mode === 'login' ? { transform: 'skewX(-10deg)' } : undefined}
          onClick={() => switchMode('login')}
        >
          <span style={mode === 'login' ? { display: 'inline-block', transform: 'skewX(10deg)' } : undefined}>
            {t('page.account.signIn')}
          </span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 ${tabClass} transition-colors ${
            mode === 'register' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
          style={mode === 'register' ? { transform: 'skewX(-10deg)' } : undefined}
          onClick={() => switchMode('register')}
        >
          <span style={mode === 'register' ? { display: 'inline-block', transform: 'skewX(10deg)' } : undefined}>
            {t('page.account.register')}
          </span>
        </button>
      </div>

      <p className="mb-6 text-center text-sm leading-relaxed text-muted">
        {mode === 'login' ? t('page.account.signInHint') : t('page.account.registerHint')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <label className="block">
            <span className={`mb-2 block ${labelClass} text-muted`}>
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
          <span className={`mb-2 block ${labelClass} text-muted`}>
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
          <span className={`mb-2 block ${labelClass} text-muted`}>
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
            <span className={`mb-2 block ${labelClass} text-muted`}>
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

        {mode === 'register' && (
          <RegisterPolicyConsents accepted={acceptedPolicies} onChange={handlePolicyChange} />
        )}

        {error && (
          <p className="border-2 border-ink bg-accent-soft/80 px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || (mode === 'register' && !policiesComplete)}
          className="btn-slam mt-2 w-full"
        >
          <span>
            {submitting
              ? t('page.account.submitting')
              : mode === 'login'
                ? t('page.account.signIn')
                : t('page.account.createAccount')}
          </span>
        </button>
      </form>
    </div>
  )
}
