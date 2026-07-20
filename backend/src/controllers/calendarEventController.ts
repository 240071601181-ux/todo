import type { Request, Response } from 'express'
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  calendarEventParamsSchema,
} from '../utils/validation.js'
import * as calendarEventService from '../services/calendarEventService.js'
import { CalendarEventError } from '../services/calendarEventService.js'

export async function list(req: Request, res: Response) {
  try {
    const dateFrom = req.query.dateFrom as string | undefined
    const dateTo = req.query.dateTo as string | undefined
    const events = await calendarEventService.listEvents(req.user!.id, { dateFrom, dateTo })
    res.json({ events })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = calendarEventParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid event ID' })
    return
  }

  try {
    const event = await calendarEventService.getEventById(req.user!.id, params.data.id)
    res.json({ event })
  } catch (err) {
    if (err instanceof CalendarEventError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createCalendarEventSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const event = await calendarEventService.createEvent(req.user!.id, parsed.data)
    res.status(201).json({ event })
  } catch (err) {
    if (err instanceof CalendarEventError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Create event error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = calendarEventParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid event ID' })
    return
  }

  const parsed = updateCalendarEventSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const event = await calendarEventService.updateEvent(req.user!.id, params.data.id, parsed.data)
    res.json({ event })
  } catch (err) {
    if (err instanceof CalendarEventError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Update event error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = calendarEventParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid event ID' })
    return
  }

  try {
    await calendarEventService.deleteEvent(req.user!.id, params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof CalendarEventError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
