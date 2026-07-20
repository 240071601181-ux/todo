import api from '../lib/api'

export interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'task_uncompleted' | 'task_updated'
  message: string
  taskId: string
  taskTitle: string
  createdAt: string
}

export async function getActivities(limit: number = 10): Promise<ActivityItem[]> {
  const res = await api.get(`/activities?limit=${limit}`)
  return res.data.activities
}
