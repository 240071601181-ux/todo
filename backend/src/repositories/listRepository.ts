import prisma from '../utils/prisma.js'
import type { List } from '@prisma/client'

export async function findAllByUser(userId: string): Promise<List[]> {
  return prisma.list.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function findById(id: string): Promise<List | null> {
  return prisma.list.findUnique({ where: { id } })
}

export async function create(data: {
  name: string
  icon?: string
  color?: string | null
  userId: string
}): Promise<List> {
  return prisma.list.create({
    data: {
      name: data.name,
      icon: data.icon ?? 'Folder',
      color: data.color ?? null,
      userId: data.userId,
    },
  })
}

export async function update(
  id: string,
  data: { name?: string; icon?: string; color?: string | null }
): Promise<List> {
  return prisma.list.update({ where: { id }, data })
}

export async function remove(id: string): Promise<void> {
  await prisma.list.delete({ where: { id } })
}
