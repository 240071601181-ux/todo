import type { Request, Response } from 'express'
import {
  notificationParamsSchema,
  notificationListQuerySchema,
} from '../utils/validation.js'
import * as notificationService from '../services/notificationService.js'
import { NotificationError } from '../services/notificationService.js'

export async function list(req: Request, res: Response) {
  const query = notificationListQuerySchema.safeParse(req.query)
  if (!query.success) {
    res.status(400).json({ message: 'Invalid query parameters' })
    return
  }

  try {
    const result = await notificationService.listNotifications(req.user!.id, query.data)
    res.json(result)
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getUnreadCount(req: Request, res: Response) {
  try {
    const count = await notificationService.getUnreadCount(req.user!.id)
    res.json({ count })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function markRead(req: Request, res: Response) {
  const params = notificationParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid notification ID' })
    return
  }

  try {
    const notif = await notificationService.markAsRead(req.user!.id, params.data.id)
    res.json({ notification: notif })
  } catch (err) {
    if (err instanceof NotificationError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function markAllRead(req: Request, res: Response) {
  try {
    await notificationService.markAllAsRead(req.user!.id)
    res.status(204).send()
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function generate(req: Request, res: Response) {
  try {
    const created = await notificationService.generateDueAndOverdueNotifications(req.user!.id)
    res.json({ generated: created.length })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}
