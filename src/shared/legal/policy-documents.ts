export type PolicyDocumentId = 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms'

export type PolicyDocument = {
  id: PolicyDocumentId
  htmlPath: string
  /** Required checkbox on registration */
  requiresConsent?: boolean
}

export const POLICY_DOCUMENTS: PolicyDocument[] = [
  { id: 'faq', htmlPath: '/legal/faq.html' },
  { id: 'shipping', htmlPath: '/legal/shipping-policy.html', requiresConsent: true },
  { id: 'returns', htmlPath: '/legal/returns-policy.html', requiresConsent: true },
  { id: 'privacy', htmlPath: '/legal/privacy-policy.html', requiresConsent: true },
  { id: 'terms', htmlPath: '/legal/terms-of-service.html', requiresConsent: true },
]

export const REGISTRATION_CONSENT_POLICIES = POLICY_DOCUMENTS.filter(
  (doc) => doc.requiresConsent,
)

export function getPolicyDocument(id: string | undefined): PolicyDocument | undefined {
  return POLICY_DOCUMENTS.find((doc) => doc.id === id)
}

export function policyDocumentPath(id: PolicyDocumentId): string {
  return `/legal/${id}`
}
