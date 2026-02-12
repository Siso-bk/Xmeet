export type Role = 'user' | 'admin' | 'org_admin'

export type AuthProvider = 'local' | 'personalai'

export type UserPublic = {
  id: string
  email: string
  role: Role
  authProvider: AuthProvider
  createdAt: string
}

export type Tokens = {
  accessToken: string
  expiresIn: number
}
