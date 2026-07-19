import api from './api'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials)
  return data
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials)
  return data
}

export async function getProfile(): Promise<AuthResponse['user']> {
  const { data } = await api.get<AuthResponse['user']>('/auth/profile')
  return data
}
