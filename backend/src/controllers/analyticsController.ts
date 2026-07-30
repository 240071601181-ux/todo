import type { Request, Response } from 'express'
import * as analyticsService from '../services/analyticsService.js'

export async function getAnalytics(req: Request, res: Response) {
  try {
    const analytics = await analyticsService.getAnalytics(req.user!.id)
    res.json({ analytics })
  } catch (err) {
    console.error('Analytics error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
