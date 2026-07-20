import * as notificationRepository from '../repositories/notificationRepository.js'
import prisma from '../utils/prisma.js'

export class NotificationError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listNotifications(
  userId: string,
  params: notificationRepository.NotificationQueryParams = {},
) {
  return notificationRepository.findAllByUser(userId, params)
}

export async function getUnreadCount(userId: string): Promise<number> {
  return notificationRepository.getUnreadCount(userId)
}

export async function markAsRead(userId: string, notificationId: string) {
  const notif = await notificationRepository.findById(notificationId)
  if (!notif) {
    throw new NotificationError('Notification not found', 404)
  }
  if (notif.userId !== userId) {
    throw new NotificationError('Forbidden', 403)
  }
  return notificationRepository.markAsRead(notificationId)
}

export async function markAllAsRead(userId: string) {
  await notificationRepository.markAllAsRead(userId)
}

export async function generateDueAndOverdueNotifications(userId: string) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfToday = new Date(startOfToday.getTime() + 86400000)

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      completed: false,
      archived: false,
      dueDate: { not: null },
    },
    select: { id: true, title: true, dueDate: true },
  })

  const existing = await prisma.notification.findMany({
    where: {
      userId,
      type: { in: ['due_today', 'overdue'] },
      read: false,
    },
    select: { relatedId: true, type: true },
  })

  const existingKeys = new Set(existing.map(n => `${n.type}:${n.relatedId}`))

  const created: string[] = []

  for (const task of tasks) {
    if (!task.dueDate) continue
    const due = new Date(task.dueDate)

    if (due < startOfToday) {
      const key = `overdue:${task.id}`
      if (!existingKeys.has(key)) {
        await notificationRepository.create({
          userId,
          type: 'overdue',
          title: 'Task Overdue',
          message: `"${task.title}" is overdue.`,
          relatedId: task.id,
        })
        created.push(key)
      }
    } else if (due >= startOfToday && due < endOfToday) {
      const key = `due_today:${task.id}`
      if (!existingKeys.has(key)) {
        await notificationRepository.create({
          userId,
          type: 'due_today',
          title: 'Due Today',
          message: `"${task.title}" is due today.`,
          relatedId: task.id,
        })
        created.push(key)
      }
    }
  }

  return created
}

export async function generateCompletedNotification(userId: string, taskId: string, taskTitle: string) {
  return notificationRepository.create({
    userId,
    type: 'completed',
    title: 'Task Completed',
    message: `"${taskTitle}" has been completed.`,
    relatedId: taskId,
  })
}

export async function generateProjectUpdateNotification(
  userId: string,
  projectId: string,
  projectName: string,
  updateDescription: string,
) {
  return notificationRepository.create({
    userId,
    type: 'project_update',
    title: 'Project Update',
    message: `"${projectName}": ${updateDescription}`,
    relatedId: projectId,
  })
}
