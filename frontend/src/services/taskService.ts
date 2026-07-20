import type { Task, TaskPriority, TaskStatus } from '../types'
import api from '../lib/api'

export interface BackendTask {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: number
  dueDate: string | null
  listId: string
  categoryId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string; slug: string; color: string | null } | null
}

export async function getTasks(): Promise<BackendTask[]> {
  const res = await api.get('/tasks')
  return res.data.tasks
}

export async function toggleTask(id: string): Promise<BackendTask> {
  const res = await api.patch(`/tasks/${id}/complete`)
  return res.data.task
}

export function mapPriority(priority: number): TaskPriority {
  if (priority >= 4) return 'urgent'
  if (priority >= 3) return 'high'
  if (priority >= 2) return 'medium'
  return 'low'
}

export function mapStatus(completed: boolean): TaskStatus {
  return completed ? 'done' : 'todo'
}

export function mapTask(
  bt: BackendTask,
  listName: string,
  userName: string,
  userAvatar: string,
): Task {
  return {
    id: bt.id,
    title: bt.title,
    description: bt.description ?? '',
    status: mapStatus(bt.completed),
    priority: mapPriority(bt.priority),
    dueDate: bt.dueDate ? bt.dueDate.split('T')[0] : '',
    assignee: {
      name: userName,
      avatar: userAvatar,
      role: 'User',
    },
    projectId: bt.listId,
    projectName: listName,
    storyPoints: 1,
    milestones: [],
    comments: [],
    tags: [],
  }
}
