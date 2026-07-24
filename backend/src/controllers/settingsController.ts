import type { Request, Response } from 'express'
import * as settingsService from '../services/settingsService.js'

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await settingsService.getSettings(req.user!.id)
    res.json({ settings })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateSettings(req: Request, res: Response) {
  const { settings } = req.body
  if (settings === undefined || settings === null || typeof settings !== 'object') {
    res.status(400).json({ message: 'Invalid settings data' })
    return
  }

  try {
    const updated = await settingsService.updateSettings(req.user!.id, settings)
    res.json({ settings: updated })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}
