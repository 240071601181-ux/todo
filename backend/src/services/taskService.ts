import * as taskRepository from '../repositories/taskRepository.js'
import prisma from '../utils/prisma.js'
import type { createTaskSchema, updateTaskSchema } from '../utils/validation.js'
import type { z } from 'zod'

type CreateInput = z.infer<typeof createTaskSchema>
type UpdateInput = z.infer<typeof updateTaskSchema>

export class TaskError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listTasks(userId: string, params: taskRepository.TaskQueryParams = {}) {
  return taskRepository.findAllByUser(userId, params)
}

export async function getTaskById(userId: string, taskId: string) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }
  return task
}

export async function createTask(userId: string, input: CreateInput) {
  const list = await prisma.list.findUnique({ where: { id: input.listId } })
  if (!list) {
    throw new TaskError('List not found', 404)
  }
  if (list.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } })
    if (!category) {
      throw new TaskError('Category not found', 404)
    }
  }

  const dueDate = input.dueDate ? new Date(input.dueDate) : null

  const task = await taskRepository.create({
    title: input.title,
    description: input.description,
    priority: input.priority,
    dueDate,
    listId: input.listId,
    categoryId: input.categoryId,
    userId,
  })

  if (input.tagIds && input.tagIds.length > 0) {
    const validTags = await prisma.tag.findMany({
      where: { id: { in: input.tagIds } },
    })
    const validTagIds = validTags.map(t => t.id)
    if (validTagIds.length > 0) {
      await taskRepository.attachTags(task.id, validTagIds)
    }
  }

  return taskRepository.findById(task.id)
}

export async function updateTask(userId: string, taskId: string, input: UpdateInput) {
  const existing = await taskRepository.findById(taskId)
  if (!existing) {
    throw new TaskError('Task not found', 404)
  }
  if (existing.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  if (input.listId) {
    const list = await prisma.list.findUnique({ where: { id: input.listId } })
    if (!list) {
      throw new TaskError('List not found', 404)
    }
    if (list.userId !== userId) {
      throw new TaskError('Forbidden', 403)
    }
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } })
    if (!category) {
      throw new TaskError('Category not found', 404)
    }
  }

  const dueDate = input.dueDate !== undefined
    ? (input.dueDate ? new Date(input.dueDate) : null)
    : undefined

  const updated = await taskRepository.update(taskId, {
    ...input,
    dueDate,
  })

  if (input.tagIds !== undefined) {
    await taskRepository.setTags(taskId, input.tagIds)
  }

  return taskRepository.findById(taskId)
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  await taskRepository.remove(taskId)
}

export async function toggleTask(userId: string, taskId: string) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  return taskRepository.toggleComplete(taskId)
}

export async function archiveTask(userId: string, taskId: string) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  return taskRepository.archive(taskId)
}

export async function restoreTask(userId: string, taskId: string) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  return taskRepository.restore(taskId)
}

export async function reorderTask(userId: string, taskId: string, sortOrder: number) {
  const task = await taskRepository.findById(taskId)
  if (!task) {
    throw new TaskError('Task not found', 404)
  }
  if (task.userId !== userId) {
    throw new TaskError('Forbidden', 403)
  }

  return taskRepository.updateSortOrder(taskId, sortOrder)
}
