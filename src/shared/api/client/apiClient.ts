/**
 * HTTP client for the Java backend.
 * Default base URL: /api in dev (Vite proxy), http://localhost:8080/api in production.
 */

import { readAuthSession } from '@/features/account/api/auth.storage'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const baseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api')

export function getApiBaseUrl(): string {
  return baseUrl
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
  const token = readAuthSession()?.token

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, body || `Request failed (${response.status})`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
