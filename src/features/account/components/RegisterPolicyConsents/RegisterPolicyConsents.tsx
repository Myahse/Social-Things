import { PolicyDocumentLink } from '@/shared/components/PolicyDocumentLink'
import { useI18n } from '@/shared/i18n/i18n'
import {
  REGISTRATION_CONSENT_POLICIES,
  type PolicyDocumentId,
} from '@/shared/legal/policy-documents'

const LEGAL_TITLE_KEYS = {
  shipping: 'legal.shipping',
  returns: 'legal.returns',
  privacy: 'legal.privacy',
  terms: 'legal.terms',
} as const

const checkboxClass =
  'mt-0.5 h-4 w-4 shrink-0 rounded border-line text-ink focus:ring-ink/30'

interface RegisterPolicyConsentsProps {
  accepted: Partial<Record<PolicyDocumentId, boolean>>
  onChange: (id: PolicyDocumentId, checked: boolean) => void
}

export function RegisterPolicyConsents({ accepted, onChange }: RegisterPolicyConsentsProps) {
  const { t } = useI18n()

  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 font-display text-xs tracking-[0.18em] text-muted">
        {t('page.account.policiesConsentTitle')}
      </legend>
      {REGISTRATION_CONSENT_POLICIES.map((doc) => {
        const titleKey = LEGAL_TITLE_KEYS[doc.id as keyof typeof LEGAL_TITLE_KEYS]
        const checked = Boolean(accepted[doc.id])

        return (
          <label
            key={doc.id}
            className={`flex cursor-pointer items-start gap-3 border-[3px] px-4 py-3 text-xs leading-relaxed transition-colors ${
              checked
                ? 'border-ink bg-ink text-white shadow-[4px_4px_0_#fff]'
                : 'border-ink/30 bg-canvas text-muted hover:border-ink'
            }`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            <input
              type="checkbox"
              required
              checked={checked}
              onChange={(e) => onChange(doc.id, e.target.checked)}
              className={checkboxClass}
            />
            <span>
              {t('page.account.agreePolicy')}{' '}
              <PolicyDocumentLink documentId={doc.id} className="text-ink">
                {t(titleKey)}
              </PolicyDocumentLink>
              .
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
