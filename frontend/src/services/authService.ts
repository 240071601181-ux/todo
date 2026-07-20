import api from '../lib/api'

export interface BackendUser {
  id: string
  name: string
  email: string
  account: string
  avatarUrl: string | null
}

export interface AuthResponse {
  user: BackendUser
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  return data
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
  return data
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken })
}

export async function getMe(): Promise<BackendUser> {
  const { data } = await api.get<{ user: BackendUser }>('/auth/me')
  return data.user
}

export async function forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
  const { data } = await api.post<{ message: string; resetToken?: string }>('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', { token, password })
  return data
}
