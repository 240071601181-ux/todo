import type { Project } from '../types'
import api from '../lib/api'

export interface BackendProject {
  id: string
  name: string
  description: string
  color: string
  status: 'planning' | 'active' | 'review' | 'completed'
  progress: number
  dueDate: string | null
  category: string
  stakeholders: { name: string; avatar: string; role: string }[]
  userId: string
  createdAt: string
  updatedAt: string
}

export async function getProjects(): Promise<BackendProject[]> {
  const res = await api.get('/projects')
  return res.data.projects
}

export async function getProjectById(id: string): Promise<BackendProject> {
  const res = await api.get(`/projects/${id}`)
  return res.data.project
}

export async function createProject(data: {
  name: string
  description?: string
  color?: string
  status?: string
  progress?: number
  dueDate?: string | null
  category?: string
  stakeholders?: { name: string; avatar: string; role: string }[]
}): Promise<BackendProject> {
  const res = await api.post('/projects', data)
  return res.data.project
}

export async function updateProject(
  id: string,
  data: {
    name?: string
    description?: string
    color?: string
    status?: string
    progress?: number
    dueDate?: string | null
    category?: string
    stakeholders?: { name: string; avatar: string; role: string }[]
  },
): Promise<BackendProject> {
  const res = await api.put(`/projects/${id}`, data)
  return res.data.project
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`)
}

export function mapProject(bp: BackendProject): Project {
  return {
    id: bp.id,
    name: bp.name,
    description: bp.description,
    color: bp.color,
    progress: bp.progress,
    status: bp.status,
    dueDate: bp.dueDate ? bp.dueDate.split('T')[0] : '',
    category: bp.category,
    stakeholders: bp.stakeholders ?? [],
    pulseFeed: [],
  }
}
