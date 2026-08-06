import { Link, Navigate, useParams } from 'react-router-dom'
import { getPolicyDocument, type PolicyDocumentId } from '@/shared/legal/policy-documents'
import { useI18n } from '@/shared/i18n/i18n'

const LEGAL_TITLE_KEYS: Record<PolicyDocumentId, 'legal.faq' | 'legal.shipping' | 'legal.returns' | 'legal.privacy' | 'legal.terms'> = {
  faq: 'legal.faq',
  shipping: 'legal.shipping',
  returns: 'legal.returns',
  privacy: 'legal.privacy',
  terms: 'legal.terms',
}

export function LegalDocumentPage() {
  const { documentId } = useParams<{ documentId: string }>()
  const { t } = useI18n()
  const doc = getPolicyDocument(documentId)

  if (!doc) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height))] w-full flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-xs tracking-[0.22em] text-muted transition-colors hover:text-ink"
        >
          ← {t('legal.back')}
        </Link>
        <p className="font-display text-xs tracking-[0.22em] text-muted">{t(LEGAL_TITLE_KEYS[doc.id])}</p>
      </div>
      <iframe
        src={doc.htmlPath}
        title={t(LEGAL_TITLE_KEYS[doc.id])}
        className="min-h-0 flex-1 w-full border-0 bg-canvas"
      />
    </div>
  )
}
