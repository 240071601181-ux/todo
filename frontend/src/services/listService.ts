import type { Project } from '../types'
import api from '../lib/api'

export interface BackendList {
  id: string
  name: string
  icon: string
  color: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export async function getLists(): Promise<BackendList[]> {
  const res = await api.get('/lists')
  return res.data.lists
}

export function mapList(bl: BackendList): Project {
  return {
    id: bl.id,
    name: bl.name,
    description: '',
    color: bl.color ?? '#3b82f6',
    progress: 0,
    status: 'active',
    dueDate: '',
    category: '',
    stakeholders: [],
    pulseFeed: [],
  }
}
