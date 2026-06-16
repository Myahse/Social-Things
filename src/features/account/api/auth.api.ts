import {
  loginWithStorage,
  logoutStorage,
  readAuthSession,
  registerWithStorage,
} from '@/features/account/api/auth.storage'
import type { AuthSession, LoginCredentials, RegisterCredentials } from '@/features/account/types'
import { apiFetch } from '@/shared/api/client'
import { isJavaApiEnabled } from '@/shared/api/config'
import { endpoints } from '@/shared/api/endpoints'

export async function fetchSession(): Promise<AuthSession | null> {
  if (!isJavaApiEnabled()) return readAuthSession()

  try {
    return await apiFetch<AuthSession>(endpoints.authSession)
  } catch {
    return readAuthSession()
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  if (!isJavaApiEnabled()) return loginWithStorage(credentials)

  const session = await apiFetch<AuthSession>(endpoints.authLogin, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return session
}

export async function register(credentials: RegisterCredentials): Promise<AuthSession> {
  if (!isJavaApiEnabled()) return registerWithStorage(credentials)

  const session = await apiFetch<AuthSession>(endpoints.authRegister, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return session
}

export async function logout(): Promise<void> {
  if (isJavaApiEnabled()) {
    try {
      await apiFetch<void>(endpoints.authLogout, { method: 'POST' })
    } catch {
      /* fall through */
    }
  }
  logoutStorage()
}
