import prisma from '../utils/prisma.js'
import type { CalendarEvent } from '@prisma/client'

export interface CalendarEventQuery {
  dateFrom?: Date
  dateTo?: Date
}

export async function findAllByUser(userId: string, query?: CalendarEventQuery): Promise<CalendarEvent[]> {
  const where: Record<string, unknown> = { userId }
  if (query?.dateFrom || query?.dateTo) {
    where.date = {}
    if (query.dateFrom) (where.date as Record<string, unknown>).gte = query.dateFrom
    if (query.dateTo) (where.date as Record<string, unknown>).lte = query.dateTo
  }
  return prisma.calendarEvent.findMany({
    where: where as any,
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
}

export async function findById(id: string): Promise<CalendarEvent | null> {
  return prisma.calendarEvent.findUnique({ where: { id } })
}

export async function create(data: {
  title: string
  date: Date
  time?: string | null
  duration?: string | null
  type?: string
  color?: string
  taskId?: string | null
  userId: string
}): Promise<CalendarEvent> {
  return prisma.calendarEvent.create({ data: data as any })
}

export async function update(
  id: string,
  data: {
    title?: string
    date?: Date
    time?: string | null
    duration?: string | null
    type?: string
    color?: string
    taskId?: string | null
  }
): Promise<CalendarEvent> {
  return prisma.calendarEvent.update({ where: { id }, data: data as any })
}

export async function remove(id: string): Promise<void> {
  await prisma.calendarEvent.delete({ where: { id } })
}
