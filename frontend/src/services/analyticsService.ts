import api from '../lib/api'

export interface CategoryBreakdownItem {
  id: string
  name: string
  count: number
  percentage: number
}

export interface BackendAnalytics {
  completedTasks: number
  pendingTasks: number
  completionPercent: number
  dueToday: number
  overdue: number
  mostActiveCategory: { id: string; name: string; count: number } | null
  weeklyCompletedCount: number[]
  monthlyCompletedCount: number[]
  categoryBreakdown: CategoryBreakdownItem[]
  productivityScore: number
  completedToday: number
  xp: number
  level: number
  nextLevelXp: number
  streakDays: number
  productivityTrend: number
}

export async function getAnalytics(): Promise<BackendAnalytics> {
  const res = await api.get('/analytics')
  return res.data.analytics
}
