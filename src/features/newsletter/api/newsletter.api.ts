import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

export async function subscribeNewsletter(email: string): Promise<void> {
  if (!isJavaApiEnabled()) {
    throw new Error('Newsletter is unavailable')
  }
  await apiFetch(endpoints.newsletter, {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  })
}
