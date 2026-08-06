import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { PolicyDocumentId } from '@/shared/legal/policy-documents'
import { policyDocumentPath } from '@/shared/legal/policy-documents'

interface PolicyDocumentLinkProps {
  documentId: PolicyDocumentId
  children: ReactNode
  className?: string
}

export function PolicyDocumentLink({
  documentId,
  children,
  className = '',
}: PolicyDocumentLinkProps) {
  return (
    <Link
      to={policyDocumentPath(documentId)}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline underline-offset-2 transition-colors hover:text-ink ${className}`}
    >
      {children}
    </Link>
  )
}
