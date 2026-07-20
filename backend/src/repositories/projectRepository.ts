import prisma from '../utils/prisma.js'
import type { Project, Prisma } from '@prisma/client'

export async function findAllByUser(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function findById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id } })
}

export async function create(data: {
  name: string
  description?: string
  color?: string
  status?: string
  progress?: number
  dueDate?: Date | null
  category?: string
  stakeholders?: Prisma.InputJsonValue
  userId: string
}): Promise<Project> {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description ?? '',
      color: data.color ?? '#3b82f6',
      status: data.status ?? 'active',
      progress: data.progress ?? 0,
      dueDate: data.dueDate ?? null,
      category: data.category ?? '',
      stakeholders: (data.stakeholders ?? []) as Prisma.InputJsonValue,
      userId: data.userId,
    },
  })
}

export async function update(
  id: string,
  data: {
    name?: string
    description?: string
    color?: string
    status?: string
    progress?: number
    dueDate?: Date | null
    category?: string
    stakeholders?: Prisma.InputJsonValue
  }
): Promise<Project> {
  return prisma.project.update({ where: { id }, data: data as any })
}

export async function remove(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } })
}
