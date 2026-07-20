import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import DashboardScreen from '../components/DashboardScreen'
import * as taskService from '../services/taskService'
import * as analyticsService from '../services/analyticsService'
import * as listService from '../services/listService'
import type { CalendarEvent } from '../types'

export default function DashboardPage() {
  const { user: ctxUser, tasks: ctxTasks, projects: ctxProjects, events: ctxEvents, settings } = useApp()
  const navigate = useNavigate()

  const [user, setUser] = useState(ctxUser)
  const [tasks, setTasks] = useState(ctxTasks)
  const [projects, setProjects] = useState(ctxProjects)
  const [events, setEvents] = useState(ctxEvents)

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksResult, backendLists, analytics] = await Promise.all([
          taskService.getTasks(),
          listService.getLists(),
          analyticsService.getAnalytics(),
        ])
        const backendTasks = tasksResult.tasks

        const listMap = new Map(backendLists.map(l => [l.id, l]))

        const mappedTasks = backendTasks.map(bt => {
          const list = listMap.get(bt.listId)
          return taskService.mapTask(bt, list?.name ?? 'General', ctxUser.name, ctxUser.avatar)
        })

        const mappedProjects = backendLists.map(listService.mapList)

        const mappedEvents: CalendarEvent[] = backendTasks
          .filter(bt => bt.dueDate)
          .map(bt => ({
            id: `task-event-${bt.id}`,
            title: bt.title,
            date: bt.dueDate!.split('T')[0],
            type: 'task' as const,
            color: '#3b82f6',
          }))

        setTasks(mappedTasks)
        setProjects(mappedProjects)
        setEvents(mappedEvents)
        setUser(prev => ({
          ...ctxUser,
          productivityScore: analytics.productivityScore,
          weeklyTaskCount: analytics.weeklyCompletedCount,
          level: prev.level,
          xp: prev.xp,
          nextLevelXp: prev.nextLevelXp,
          streakDays: prev.streakDays,
        }))
      } catch (err) {
        console.error('Failed to load dashboard data, using fallback:', err)
      }
    }
    loadData()
  }, [])

  return (
    <DashboardScreen
      user={user}
      setUser={setUser}
      tasks={tasks}
      setTasks={setTasks}
      projects={projects}
      events={events}
      settings={settings}
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
