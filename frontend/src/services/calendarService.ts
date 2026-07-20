import api from '../lib/api'
import type { CalendarEvent } from '../types'

export interface BackendCalendarEvent {
  id: string
  title: string
  date: string
  time: string | null
  duration: string | null
  type: 'task' | 'meeting' | 'milestone' | 'focus'
  color: string
  taskId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export async function getEvents(params?: { dateFrom?: string; dateTo?: string }): Promise<BackendCalendarEvent[]> {
  const query: Record<string, string> = {}
  if (params?.dateFrom) query.dateFrom = params.dateFrom
  if (params?.dateTo) query.dateTo = params.dateTo
  const res = await api.get('/calendar-events', { params: query })
  return res.data.events
}

export async function getEventById(id: string): Promise<BackendCalendarEvent> {
  const res = await api.get(`/calendar-events/${id}`)
  return res.data.event
}

export async function createEvent(data: {
  title: string
  date: string
  time?: string
  duration?: string
  type?: string
  color?: string
  taskId?: string | null
}): Promise<BackendCalendarEvent> {
  const res = await api.post('/calendar-events', data)
  return res.data.event
}

export async function updateEvent(
  id: string,
  data: {
    title?: string
    date?: string
    time?: string | null
    duration?: string | null
    type?: string
    color?: string
  },
): Promise<BackendCalendarEvent> {
  const res = await api.put(`/calendar-events/${id}`, data)
  return res.data.event
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/calendar-events/${id}`)
}

export function mapEvent(be: BackendCalendarEvent): CalendarEvent {
  return {
    id: be.id,
    title: be.title,
    date: be.date.split('T')[0],
    time: be.time ?? undefined,
    duration: be.duration ?? undefined,
    type: be.type,
    color: be.color,
    taskId: be.taskId ?? undefined,
  }
}
