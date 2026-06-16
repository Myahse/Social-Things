import type { AuthSession, AuthUser, LoginCredentials, RegisterCredentials } from '@/features/account/types'

const SESSION_KEY = 'social-things:auth-session'
const USERS_KEY = 'social-things:auth-users'

interface StoredUser extends AuthUser {
  password: string
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.user?.id || !parsed.user.email) return null
    return parsed
  } catch {
    return null
  }
}

export function writeAuthSession(session: AuthSession | null) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loginWithStorage(credentials: LoginCredentials): AuthSession {
  const email = credentials.email.trim().toLowerCase()
  const user = readUsers().find((u) => u.email === email)
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid email or password')
  }

  const session: AuthSession = {
    user: { id: user.id, email: user.email, name: user.name },
    token: `local-${user.id}`,
  }
  writeAuthSession(session)
  return session
}

export function registerWithStorage(credentials: RegisterCredentials): AuthSession {
  const email = credentials.email.trim().toLowerCase()
  const users = readUsers()

  if (users.some((u) => u.email === email)) {
    throw new Error('An account with this email already exists')
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    name: credentials.name.trim(),
    password: credentials.password,
  }

  writeUsers([...users, user])

  const session: AuthSession = {
    user: { id: user.id, email: user.email, name: user.name },
    token: `local-${user.id}`,
  }
  writeAuthSession(session)
  return session
}

export function logoutStorage() {
  writeAuthSession(null)
}
