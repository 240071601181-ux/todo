import api from './api'

export interface Analytics {
  completedTasks: number
  pendingTasks: number
  completionPercent: number
  dueToday: number
  overdue: number
  mostActiveCategory: { id: string; name: string; count: number } | null
}

export async function fetchAnalytics(): Promise<Analytics> {
  const { data } = await api.get<{ analytics: Analytics }>('/analytics')
  return data.analytics
}
