import api from '../lib/api'
import type { AppSettings } from '../types'

export async function getSettings(): Promise<Record<string, unknown>> {
  const res = await api.get('/settings')
  return res.data.settings as Record<string, unknown>
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<Record<string, unknown>> {
  const res = await api.put('/settings', { settings })
  return res.data.settings as Record<string, unknown>
}
