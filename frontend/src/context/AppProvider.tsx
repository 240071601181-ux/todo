import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CALENDAR_EVENTS,
} from '../data'
import type { Task, Project, CalendarEvent, AppSettings, UserProfile } from '../types'

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
  login: (name: string, email: string) => void
  logout: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserProfile>(INITIAL_USER)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS)
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)

  const login = useCallback((name: string, email: string) => {
    setUser((u) => ({
      ...u,
      name,
      email,
      role:
        name.toLowerCase().includes('lead') || name.toLowerCase().includes('architect')
          ? 'Lead Systems Architect'
          : 'Senior Fullstack Engineer',
    }))
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
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
        login,
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
