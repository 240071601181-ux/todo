import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppProvider'
import CalendarScreen from '../components/CalendarScreen'
import * as calendarService from '../services/calendarService'
import * as taskService from '../services/taskService'
import type { CalendarEvent } from '../types'

export default function CalendarPage() {
  const { settings } = useApp()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const [backendEvents, tasksResult] = await Promise.all([
        calendarService.getEvents(),
        taskService.getTasks({ limit: 200 }),
      ])

      const mapped = backendEvents.map(calendarService.mapEvent)

      const taskEvents: CalendarEvent[] = tasksResult.tasks
        .filter(bt => bt.dueDate)
        .map(bt => ({
          id: `task-${bt.id}`,
          title: bt.title,
          date: bt.dueDate!.split('T')[0],
          time: undefined,
          duration: undefined,
          type: 'task' as const,
          color: '#3b82f6',
          taskId: bt.id,
        }))

      const merged = [...mapped]
      for (const te of taskEvents) {
        if (!merged.some(e => e.id === te.id)) {
          merged.push(te)
        }
      }

      setEvents(merged)
    } catch {
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleCreateEvent = async (data: Parameters<typeof calendarService.createEvent>[0]) => {
    try {
      const created = await calendarService.createEvent(data)
      const mapped = calendarService.mapEvent(created)
      setEvents(prev => [...prev, mapped])
    } catch (err) {
      console.error('Create event failed:', err)
    }
  }

  const handleUpdateEvent = async (id: string, data: Parameters<typeof calendarService.updateEvent>[1]) => {
    if (id.startsWith('task-')) return
    try {
      const updated = await calendarService.updateEvent(id, data)
      const mapped = calendarService.mapEvent(updated)
      setEvents(prev => prev.map(e => e.id === id ? mapped : e))
    } catch (err) {
      console.error('Update event failed:', err)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (id.startsWith('task-')) return
    try {
      await calendarService.deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Delete event failed:', err)
    }
  }

  return (
    <CalendarScreen
      isLoading={isLoading}
      events={events}
      setEvents={setEvents}
      onCreateEvent={handleCreateEvent}
      onUpdateEvent={handleUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
      settings={settings}
    />
  )
}
