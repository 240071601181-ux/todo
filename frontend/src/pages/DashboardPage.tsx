import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import DashboardScreen from '../components/DashboardScreen'
import * as taskService from '../services/taskService'
import * as analyticsService from '../services/analyticsService'
import * as listService from '../services/listService'
import * as calendarService from '../services/calendarService'
import * as activityService from '../services/activityService'
import type { CalendarEvent } from '../types'

const EMPTY_ANALYTICS: analyticsService.BackendAnalytics = {
  completedTasks: 0,
  pendingTasks: 0,
  completionPercent: 0,
  dueToday: 0,
  overdue: 0,
  mostActiveCategory: null,
  weeklyCompletedCount: [0, 0, 0, 0, 0, 0, 0],
  monthlyCompletedCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  categoryBreakdown: [],
  productivityScore: 0,
  completedToday: 0,
  xp: 0,
  level: 1,
  nextLevelXp: 1000,
  streakDays: 0,
  productivityTrend: 0,
}

function safeTasksResult(input: unknown) {
  if (!input || typeof input !== 'object') return { tasks: [] }
  const r = input as Record<string, unknown>
  return { tasks: Array.isArray(r.tasks) ? r.tasks : [] }
}

function safeLists(input: unknown) {
  return Array.isArray(input) ? input : []
}

function safeActivities(input: unknown) {
  return Array.isArray(input) ? input : []
}

function safeCalendarEvents(input: unknown) {
  return Array.isArray(input) ? input : []
}

function LoadingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      <div className="border-b border-slate-800/50 pb-6">
        <div className="h-3 w-48 bg-slate-800/50 rounded animate-pulse mb-2" />
        <div className="h-8 w-72 bg-slate-800/50 rounded animate-pulse mb-1" />
        <div className="h-4 w-96 bg-slate-800/30 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#0c0f16]/90 border border-slate-800/60 rounded-2xl p-5 h-28 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0c0f16]/90 border border-slate-800/60 rounded-2xl p-5 h-64 animate-pulse" />
        <div className="bg-[#0c0f16]/90 border border-slate-800/60 rounded-2xl p-5 h-64 animate-pulse" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user: ctxUser, tasks: ctxTasks, projects: ctxProjects, events: ctxEvents, settings } = useApp()
  const navigate = useNavigate()

  const [user, setUser] = useState(ctxUser)
  const [tasks, setTasks] = useState(ctxTasks)
  const [projects, setProjects] = useState(ctxProjects)
  const [events, setEvents] = useState(ctxEvents)
  const [activities, setActivities] = useState<activityService.ActivityItem[]>([])
  const [monthlyCompletedCount, setMonthlyCompletedCount] = useState<number[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<analyticsService.CategoryBreakdownItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const raw = await Promise.allSettled([
          taskService.getTasks().catch(() => ({ tasks: [] })),
          listService.getLists().catch(() => []),
          analyticsService.getAnalytics().catch(() => EMPTY_ANALYTICS),
          calendarService.getEvents({ dateFrom: new Date().toISOString().split('T')[0] }).catch(() => []),
          activityService.getActivities(10).catch(() => []),
        ])

        if (cancelled) return

        const tasksResult = safeTasksResult(raw[0].status === 'fulfilled' ? raw[0].value : null)
        const backendLists = safeLists(raw[1].status === 'fulfilled' ? raw[1].value : null)
        const analytics = raw[2].status === 'fulfilled' ? raw[2].value : EMPTY_ANALYTICS
        const rawEvents = safeCalendarEvents(raw[3].status === 'fulfilled' ? raw[3].value : null)
        const rawActivities = safeActivities(raw[4].status === 'fulfilled' ? raw[4].value : null)

        const backendTasks = tasksResult.tasks
        const listMap = new Map(backendLists.map(l => [l.id, l]))

        const mappedTasks = backendTasks.map(bt => {
          const list = listMap.get(bt.listId)
          return taskService.mapTask(bt, list?.name ?? 'General', ctxUser.name, ctxUser.avatar)
        })

        const mappedProjects = backendLists.map(listService.mapList)

        const taskEvents: CalendarEvent[] = backendTasks
          .filter(bt => bt.dueDate)
          .map(bt => ({
            id: `task-event-${bt.id}`,
            title: bt.title,
            date: bt.dueDate!.split('T')[0],
            type: 'task' as const,
            color: '#3b82f6',
          }))

        const apiEvents: CalendarEvent[] = rawEvents.map(calendarService.mapEvent)

        const seen = new Set<string>()
        const mergedEvents: CalendarEvent[] = []
        for (const ev of [...apiEvents, ...taskEvents]) {
          if (!seen.has(ev.id)) {
            seen.add(ev.id)
            mergedEvents.push(ev)
          }
        }

        setTasks(mappedTasks)
        setProjects(mappedProjects)
        setEvents(mergedEvents)
        setActivities(rawActivities)
        setMonthlyCompletedCount(analytics.monthlyCompletedCount)
        setCategoryBreakdown(analytics.categoryBreakdown)
        setUser(prev => ({
          ...ctxUser,
          productivityScore: analytics.productivityScore,
          weeklyTaskCount: analytics.weeklyCompletedCount,
          productivityTrend: analytics.productivityTrend,
          level: analytics.level,
          xp: analytics.xp,
          nextLevelXp: analytics.nextLevelXp,
          streakDays: analytics.streakDays,
        }))
      } catch (err) {
        console.error('Failed to load dashboard data, using fallback:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadData()

    return () => { cancelled = true }
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <DashboardScreen
      user={user}
      setUser={setUser}
      tasks={tasks}
      setTasks={setTasks}
      projects={projects}
      events={events}
      settings={settings}
      activities={activities}
      monthlyCompletedCount={monthlyCompletedCount}
      categoryBreakdown={categoryBreakdown}
      setActiveTab={(tab) => {
        if (tab.startsWith('project-detail:')) {
          const projId = tab.split(':')[1]
          navigate(`/projects/${projId}`)
        } else {
          navigate(`/${tab}`)
        }
      }}
      setSelectedTaskId={(id) => {
        if (id) navigate(`/tasks/${id}`)
      }}
    />
  )
}
