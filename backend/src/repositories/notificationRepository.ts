import prisma from '../utils/prisma.js'
import type { Notification, Prisma } from '@prisma/client'

export interface NotificationQueryParams {
  page?: number
  limit?: number
}

export interface PaginatedNotifications {
  notifications: Notification[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function findAllByUser(
  userId: string,
  params: NotificationQueryParams = {},
): Promise<PaginatedNotifications> {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 50))
  const skip = (page - 1) * limit

  const where: Prisma.NotificationWhereInput = { userId }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ])

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function findById(id: string): Promise<Notification | null> {
  return prisma.notification.findUnique({ where: { id } })
}

export async function create(data: {
  userId: string
  type: string
  title: string
  message: string
  relatedId?: string | null
}): Promise<Notification> {
  return prisma.notification.create({ data })
}

export async function markAsRead(id: string): Promise<Notification> {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  })
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, read: false },
  })
}
