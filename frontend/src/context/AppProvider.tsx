import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
} from '../data'
import type { Task, Project, CalendarEvent, AppSettings, UserProfile } from '../types'
import * as authService from '../services/authService'
import * as projectService from '../services/projectService'

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
  }, [fetchProjects])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password)
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    setUser(mapBackendUser(response.user))
    setIsAuthenticated(true)
    await fetchProjects()
  }, [fetchProjects])

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
