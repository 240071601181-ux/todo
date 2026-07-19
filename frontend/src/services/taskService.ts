import api from './api'
import type { Task } from '../types/todo'

interface ApiCategory {
  id: string
  name: string
  slug: string
  color: string | null
}

interface ApiTask {
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
  category: ApiCategory | null
}

interface ApiList {
  id: string
  name: string
  icon: string
  color: string | null
  userId: string
}

function mapApiTask(apiTask: ApiTask): Task {
  const tag = apiTask.category
    ? `#${apiTask.category.name.toUpperCase()}`
    : '#NEW'

  const variant = (apiTask.category?.color ?? 'tertiary') as Task['tagVariant']

  let time: string
  if (apiTask.completed && !apiTask.dueDate) {
    time = 'Completed'
  } else if (apiTask.dueDate) {
    const d = new Date(apiTask.dueDate)
    const now = new Date()
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    if (isToday) {
      time = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      time = `Today at ${time}`
    } else {
      time = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    }
  } else {
    time = 'No due date'
  }

  return { id: apiTask.id, title: apiTask.title, tag, tagVariant: variant, time, completed: apiTask.completed }
}

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<{ tasks: ApiTask[] }>('/tasks')
  return data.tasks.map(mapApiTask)
}

export async function createTask(title: string, listId: string): Promise<Task> {
  const { data } = await api.post<{ task: ApiTask }>('/tasks', { title, listId })
  return mapApiTask(data.task)
}

export async function toggleTaskCompletion(id: string): Promise<Task> {
  const { data } = await api.patch<{ task: ApiTask }>(`/tasks/${id}/complete`)
  return mapApiTask(data.task)
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}

export async function fetchLists(): Promise<ApiList[]> {
  const { data } = await api.get<{ lists: ApiList[] }>('/lists')
  return data.lists
}
