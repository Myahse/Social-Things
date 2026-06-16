import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '@/features/account/api'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/features/account/types'
import { readAuthSession, writeAuthSession } from '@/features/account/api/auth.storage'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const local = readAuthSession()
      if (local?.user) {
        if (!cancelled) setUser(local.user)
      }

      try {
        const session = await authApi.fetchSession()
        if (!cancelled && session?.user) {
          setUser(session.user)
          writeAuthSession(session)
        }
      } catch {
        /* keep local session if any */
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await authApi.login(credentials)
    writeAuthSession(session)
    setUser(session.user)
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const session = await authApi.register(credentials)
    writeAuthSession(session)
    setUser(session.user)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
