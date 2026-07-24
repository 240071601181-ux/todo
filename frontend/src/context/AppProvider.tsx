import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
} from '../data'
import type { Task, Project, CalendarEvent, AppSettings, UserProfile, Notification } from '../types'
import * as authService from '../services/authService'
import * as projectService from '../services/projectService'
import * as notificationService from '../services/notificationService'
import * as settingsService from '../services/settingsService'

interface AppContextValue {
  user: UserProfile
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  events: CalendarEvent[]
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>
  settings: AppSettings
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  notifications: Notification[]
  unreadCount: number
  refreshNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  isAuthenticated: boolean
  isAuthLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

function mapBackendUser(user: authService.BackendUser): UserProfile {
  return {
    name: user.name,
    email: user.email,
    role: 'User',
    avatar: user.avatarUrl ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    streakDays: 0,
    productivityScore: 0,
    weeklyTaskCount: [0, 0, 0, 0, 0, 0, 0],
    productivityTrend: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 1000,
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [user, setUser] = useState<UserProfile>(INITIAL_USER)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS)
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const settingsSaveTimer = useRef<ReturnType<typeof setTimeout>>()

  const saveSettings = useCallback(async (s: AppSettings) => {
    try {
      await settingsService.updateSettings(s)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (settingsSaveTimer.current) clearTimeout(settingsSaveTimer.current)
    settingsSaveTimer.current = setTimeout(() => {
      saveSettings(settings)
    }, 2000)
    return () => {
      if (settingsSaveTimer.current) clearTimeout(settingsSaveTimer.current)
    }
  }, [settings, saveSettings])

  const refreshNotifications = useCallback(async () => {
    try {
      await notificationService.generateNotifications()
      const [data, count] = await Promise.all([
        notificationService.getNotifications({ limit: 50 }),
        notificationService.getUnreadCount(),
      ])
      setNotifications(data.notifications.map(notificationService.mapNotification))
      setUnreadCount(count)
    } catch {
      // silently fail
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // silently fail
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // silently fail
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    try {
      const backendProjects = await projectService.getProjects()
      if (backendProjects.length > 0) {
        setProjects(backendProjects.map(projectService.mapProject))
      } else {
        setProjects(INITIAL_PROJECTS)
      }
    } catch {
      setProjects(INITIAL_PROJECTS)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsAuthLoading(false)
      return
    }

    authService
      .getMe()
      .then(async (backendUser) => {
        setUser(mapBackendUser(backendUser))
        setIsAuthenticated(true)
        await fetchProjects()
        await refreshNotifications()
        settingsService.getSettings().then(saved => {
          if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
            setSettings(prev => ({ ...prev, ...saved } as AppSettings))
          }
        }).catch(() => {})
      })
      .catch(async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken')
        if (storedRefreshToken) {
          try {
            const refreshed = await authService.refresh(storedRefreshToken)
            localStorage.setItem('accessToken', refreshed.accessToken)
            localStorage.setItem('refreshToken', refreshed.refreshToken)
            setUser(mapBackendUser(refreshed.user))
            setIsAuthenticated(true)
            await fetchProjects()
            await refreshNotifications()
            settingsService.getSettings().then(saved => {
              if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
                setSettings(prev => ({ ...prev, ...saved } as AppSettings))
              }
            }).catch(() => {})
          } catch {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
          }
        } else {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
        }
      })
      .finally(() => {
        setIsAuthLoading(false)
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password)
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    setUser(mapBackendUser(response.user))
    setIsAuthenticated(true)
    await fetchProjects()
    await refreshNotifications()
  }, [fetchProjects, refreshNotifications])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password)
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    setUser(mapBackendUser(response.user))
    setIsAuthenticated(true)
    await fetchProjects()
    await refreshNotifications()
  }, [fetchProjects, refreshNotifications])

  const logout = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (storedRefreshToken) {
      try {
        await authService.logout(storedRefreshToken)
      } catch {
        // ignore logout errors
      }
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks,
        projects,
        setProjects,
        events,
        setEvents,
        settings,
        setSettings,
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        isAuthenticated,
        isAuthLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return ctx
}
