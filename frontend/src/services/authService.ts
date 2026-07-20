import api from '../lib/api'
import type { UserProfile } from '../types'

export interface AuthResponse {
  user: UserProfile
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

export async function getMe(): Promise<{ user: UserProfile }> {
  const { data } = await api.get<{ user: UserProfile }>('/auth/me')
  return data
}
