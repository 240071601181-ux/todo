import type { Notification } from '../types'
import api from '../lib/api'

export interface BackendNotification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  relatedId: string | null
  read: boolean
  createdAt: string
}

export interface PaginatedNotifications {
  notifications: BackendNotification[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getNotifications(params?: { page?: number; limit?: number }): Promise<PaginatedNotifications> {
  const query: Record<string, string> = {}
  if (params?.page) query.page = String(params.page)
  if (params?.limit) query.limit = String(params.limit)
  const res = await api.get('/notifications', { params: query })
  return res.data
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get('/notifications/unread-count')
  return res.data.count
}

export async function markAsRead(id: string): Promise<BackendNotification> {
  const res = await api.patch(`/notifications/${id}/read`)
  return res.data.notification
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all')
}

export async function generateNotifications(): Promise<number> {
  const res = await api.post('/notifications/generate')
  return res.data.generated
}

export function mapNotification(bn: BackendNotification): Notification {
  return {
    id: bn.id,
    type: bn.type as Notification['type'],
    title: bn.title,
    message: bn.message,
    relatedId: bn.relatedId ?? undefined,
    read: bn.read,
    createdAt: bn.createdAt,
  }
}
