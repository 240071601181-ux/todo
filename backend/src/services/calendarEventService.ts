import * as calendarEventRepository from '../repositories/calendarEventRepository.js'
import type { createCalendarEventSchema, updateCalendarEventSchema } from '../utils/validation.js'
import type { z } from 'zod'

type CreateInput = z.infer<typeof createCalendarEventSchema>
type UpdateInput = z.infer<typeof updateCalendarEventSchema>

export class CalendarEventError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listEvents(
  userId: string,
  query?: { dateFrom?: string; dateTo?: string }
) {
  const dateFrom = query?.dateFrom ? new Date(query.dateFrom) : undefined
  const dateTo = query?.dateTo ? new Date(query.dateTo) : undefined
  return calendarEventRepository.findAllByUser(userId, { dateFrom, dateTo })
}

export async function getEventById(userId: string, eventId: string) {
  const event = await calendarEventRepository.findById(eventId)
  if (!event) {
    throw new CalendarEventError('Event not found', 404)
  }
  if (event.userId !== userId) {
    throw new CalendarEventError('Forbidden', 403)
  }
  return event
}

export async function createEvent(userId: string, input: CreateInput) {
  return calendarEventRepository.create({
    title: input.title,
    date: new Date(input.date),
    time: input.time,
    duration: input.duration,
    type: input.type,
    color: input.color,
    taskId: input.taskId,
    userId,
  })
}

export async function updateEvent(userId: string, eventId: string, input: UpdateInput) {
  const existing = await calendarEventRepository.findById(eventId)
  if (!existing) {
    throw new CalendarEventError('Event not found', 404)
  }
  if (existing.userId !== userId) {
    throw new CalendarEventError('Forbidden', 403)
  }

  const data: Record<string, unknown> = { ...input }
  if (input.date) data.date = new Date(input.date)

  return calendarEventRepository.update(eventId, data as any)
}

export async function deleteEvent(userId: string, eventId: string) {
  const event = await calendarEventRepository.findById(eventId)
  if (!event) {
    throw new CalendarEventError('Event not found', 404)
  }
  if (event.userId !== userId) {
    throw new CalendarEventError('Forbidden', 403)
  }

  await calendarEventRepository.remove(eventId)
}
