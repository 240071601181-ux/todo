import prisma from '../utils/prisma.js'
import type { Task, Category } from '@prisma/client'

export type TaskWithCategory = Task & { category: Category | null }

export async function findAllByUser(userId: string): Promise<TaskWithCategory[]> {
  return prisma.task.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function findById(id: string): Promise<TaskWithCategory | null> {
  return prisma.task.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function create(data: {
  title: string
  description?: string | null
  priority?: number
  dueDate?: Date | null
  listId: string
  categoryId?: string | null
  userId: string
}): Promise<TaskWithCategory> {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? 0,
      dueDate: data.dueDate ?? null,
      listId: data.listId,
      categoryId: data.categoryId ?? null,
      userId: data.userId,
    },
    include: { category: true },
  })
}

export async function update(
  id: string,
  data: {
    title?: string
    description?: string | null
    priority?: number
    dueDate?: Date | null
    listId?: string
    categoryId?: string | null
  }
): Promise<TaskWithCategory> {
  return prisma.task.update({
    where: { id },
    data,
    include: { category: true },
  })
}

export async function remove(id: string): Promise<void> {
  await prisma.task.delete({ where: { id } })
}

export async function toggleComplete(id: string): Promise<TaskWithCategory> {
  const task = await prisma.task.findUniqueOrThrow({ where: { id } })
  return prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
    include: { category: true },
  })
}
