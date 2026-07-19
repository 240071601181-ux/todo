import api from './api'
import type { Task } from '../types/todo'

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks')
  return data
}

export async function createTask(title: string): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', { title })
  return data
}

export async function toggleTaskCompletion(id: string): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/toggle`)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
