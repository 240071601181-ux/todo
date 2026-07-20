import prisma from '../utils/prisma.js'
import type { Task, Category, Tag } from '@prisma/client'
import type { Prisma } from '@prisma/client'

export type TaskWithRelations = Task & { category: Category | null; tags: { tag: Tag }[] }

export interface TaskQueryParams {
  search?: string
  completed?: boolean
  archived?: boolean
  priority?: number
  listId?: string
  categoryId?: string
  dueDateFrom?: string
  dueDateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  tasks: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function buildWhereClause(userId: string, params: TaskQueryParams): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = { userId }

  if (params.archived !== undefined) {
    where.archived = params.archived
  } else {
    where.archived = false
  }

  if (params.completed !== undefined) {
    where.completed = params.completed
  }

  if (params.priority !== undefined) {
    where.priority = params.priority
  }

  if (params.listId) {
    where.listId = params.listId
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.dueDateFrom || params.dueDateTo) {
    where.dueDate = {}
    if (params.dueDateFrom) {
      where.dueDate.gte = new Date(params.dueDateFrom)
    }
    if (params.dueDateTo) {
      where.dueDate.lte = new Date(params.dueDateTo)
    }
  }

  return where
}

function buildOrderBy(params: TaskQueryParams): Prisma.TaskOrderByWithRelationInput[] {
  const field = params.sortBy || 'createdAt'
  const order = params.sortOrder || 'desc'

  const allowedFields = ['createdAt', 'dueDate', 'priority', 'title', 'updatedAt', 'sortOrder']
  const sortField = allowedFields.includes(field) ? field : 'createdAt'

  return [{ [sortField]: order }, { id: 'asc' }]
}

export async function findAllByUser(
  userId: string,
  params: TaskQueryParams = {},
): Promise<PaginatedResult<TaskWithRelations>> {
  const where = buildWhereClause(userId, params)
  const orderBy = buildOrderBy(params)
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 50))
  const skip = (page - 1) * limit

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { category: true, tags: { include: { tag: true } } },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ])

  return {
    tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function findById(id: string): Promise<TaskWithRelations | null> {
  return prisma.task.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function create(data: {
  title: string
  description?: string | null
  priority?: number
  dueDate?: Date | null
  sortOrder?: number
  listId: string
  categoryId?: string | null
  userId: string
}): Promise<TaskWithRelations> {
  const maxSort = await prisma.task.aggregate({
    where: { userId: data.userId, listId: data.listId },
    _max: { sortOrder: true },
  })

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? 0,
      dueDate: data.dueDate ?? null,
      sortOrder: data.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1,
      listId: data.listId,
      categoryId: data.categoryId ?? null,
      userId: data.userId,
    },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function update(
  id: string,
  data: {
    title?: string
    description?: string | null
    priority?: number
    dueDate?: Date | null
    sortOrder?: number
    listId?: string
    categoryId?: string | null
    completed?: boolean
    archived?: boolean
  },
): Promise<TaskWithRelations> {
  return prisma.task.update({
    where: { id },
    data,
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function remove(id: string): Promise<void> {
  await prisma.task.delete({ where: { id } })
}

export async function toggleComplete(id: string): Promise<TaskWithRelations> {
  const task = await prisma.task.findUniqueOrThrow({ where: { id } })
  return prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function archive(id: string): Promise<TaskWithRelations> {
  return prisma.task.update({
    where: { id },
    data: { archived: true },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function restore(id: string): Promise<TaskWithRelations> {
  return prisma.task.update({
    where: { id },
    data: { archived: false },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function updateSortOrder(
  id: string,
  sortOrder: number,
): Promise<TaskWithRelations> {
  return prisma.task.update({
    where: { id },
    data: { sortOrder },
    include: { category: true, tags: { include: { tag: true } } },
  })
}

export async function attachTags(taskId: string, tagIds: string[]): Promise<void> {
  await prisma.taskTag.createMany({
    data: tagIds.map(tagId => ({ taskId, tagId })),
    skipDuplicates: true,
  })
}

export async function detachTags(taskId: string, tagIds: string[]): Promise<void> {
  await prisma.taskTag.deleteMany({
    where: { taskId, tagId: { in: tagIds } },
  })
}

export async function setTags(taskId: string, tagIds: string[]): Promise<void> {
  await prisma.taskTag.deleteMany({ where: { taskId } })
  if (tagIds.length > 0) {
    await prisma.taskTag.createMany({
      data: tagIds.map(tagId => ({ taskId, tagId })),
    })
  }
}
