import type { Task, TaskPriority, TaskStatus } from '../types'
import api from '../lib/api'

export interface BackendTaskTag {
  tag: {
    id: string
    name: string
    slug: string
    color: string | null
  }
}

export interface BackendTask {
  id: string
  title: string
  description: string | null
  completed: boolean
  archived: boolean
  priority: number
  dueDate: string | null
  sortOrder: number
  listId: string
  categoryId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  category: { id: string; name: string; slug: string; color: string | null } | null
  tags: BackendTaskTag[]
}

export interface BackendList {
  id: string
  name: string
  icon: string
  color: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface BackendCategory {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface BackendTag {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface TaskQueryParams {
  search?: string
  completed?: boolean
  archived?: boolean
  priority?: number
  listId?: string
  categoryId?: string
  dueDateFrom?: string
  dueDateTo?: string
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'updatedAt' | 'sortOrder'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResult {
  tasks: BackendTask[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getTasks(params?: TaskQueryParams): Promise<PaginatedResult> {
  const query: Record<string, string> = {}
  if (params) {
    if (params.search) query.search = params.search
    if (params.completed !== undefined) query.completed = String(params.completed)
    if (params.archived !== undefined) query.archived = String(params.archived)
    if (params.priority !== undefined) query.priority = String(params.priority)
    if (params.listId) query.listId = params.listId
    if (params.categoryId) query.categoryId = params.categoryId
    if (params.dueDateFrom) query.dueDateFrom = params.dueDateFrom
    if (params.dueDateTo) query.dueDateTo = params.dueDateTo
    if (params.sortBy) query.sortBy = params.sortBy
    if (params.sortOrder) query.sortOrder = params.sortOrder
    if (params.page) query.page = String(params.page)
    if (params.limit) query.limit = String(params.limit)
  }
  const res = await api.get('/tasks', { params: query })
  return res.data
}

export async function getTaskById(id: string): Promise<BackendTask> {
  const res = await api.get(`/tasks/${id}`)
  return res.data.task
}

export async function createTask(data: {
  title: string
  description?: string
  priority?: number
  dueDate?: string | null
  listId: string
  categoryId?: string | null
  tagIds?: string[]
}): Promise<BackendTask> {
  const res = await api.post('/tasks', data)
  return res.data.task
}

export async function updateTask(
  id: string,
  data: {
    title?: string
    description?: string | null
    priority?: number
    dueDate?: string | null
    listId?: string
    categoryId?: string | null
    completed?: boolean
    archived?: boolean
    tagIds?: string[]
  },
): Promise<BackendTask> {
  const res = await api.put(`/tasks/${id}`, data)
  return res.data.task
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}

export async function toggleTask(id: string): Promise<BackendTask> {
  const res = await api.patch(`/tasks/${id}/complete`)
  return res.data.task
}

export async function archiveTask(id: string): Promise<BackendTask> {
  const res = await api.patch(`/tasks/${id}/archive`)
  return res.data.task
}

export async function restoreTask(id: string): Promise<BackendTask> {
  const res = await api.patch(`/tasks/${id}/restore`)
  return res.data.task
}

export async function reorderTask(id: string, sortOrder: number): Promise<BackendTask> {
  const res = await api.patch(`/tasks/${id}/reorder`, { sortOrder })
  return res.data.task
}

// Categories
export async function getCategories(): Promise<BackendCategory[]> {
  const res = await api.get('/categories')
  return res.data.categories
}

export async function createCategory(data: { name: string; slug?: string; color?: string }): Promise<BackendCategory> {
  const res = await api.post('/categories', data)
  return res.data.category
}

// Tags
export async function getTags(): Promise<BackendTag[]> {
  const res = await api.get('/tags')
  return res.data.tags
}

export async function createTag(data: { name: string; slug?: string; color?: string }): Promise<BackendTag> {
  const res = await api.post('/tags', data)
  return res.data.tag
}

// Mappers
export function mapPriority(priority: number): TaskPriority {
  if (priority >= 4) return 'urgent'
  if (priority >= 3) return 'high'
  if (priority >= 2) return 'medium'
  return 'low'
}

export function mapPriorityToNumber(priority: TaskPriority): number {
  switch (priority) {
    case 'urgent': return 4
    case 'high': return 3
    case 'medium': return 2
    case 'low': return 1
  }
}

export function mapStatus(completed: boolean, archived: boolean = false): TaskStatus {
  if (archived) return 'done'
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
    status: mapStatus(bt.completed, bt.archived),
    priority: mapPriority(bt.priority),
    dueDate: bt.dueDate ? bt.dueDate.split('T')[0] : '',
    assignee: {
      name: userName,
      avatar: userAvatar,
      role: 'User',
    },
    projectId: bt.listId,
    projectName: listName,
    categoryId: bt.categoryId ?? undefined,
    categoryName: bt.category?.name ?? undefined,
    storyPoints: 1,
    milestones: [],
    comments: [],
    tags: bt.tags.map(tt => tt.tag.name),
  }
}
