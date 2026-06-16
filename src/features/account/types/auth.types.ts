export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthSession {
  user: AuthUser
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}
