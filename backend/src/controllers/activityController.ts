import type { Request, Response } from 'express'
import * as activityService from '../services/activityService.js'

export async function getActivities(req: Request, res: Response) {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50)
    const activities = await activityService.getRecentActivities(req.user!.id, limit)
    res.json({ activities })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}
