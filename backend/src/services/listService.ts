import * as listRepository from '../repositories/listRepository.js'
import type { createListSchema, updateListSchema } from '../utils/validation.js'
import type { z } from 'zod'

type CreateInput = z.infer<typeof createListSchema>
type UpdateInput = z.infer<typeof updateListSchema>

export class ListError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listLists(userId: string) {
  return listRepository.findAllByUser(userId)
}

export async function getListById(userId: string, listId: string) {
  const list = await listRepository.findById(listId)
  if (!list) {
    throw new ListError('List not found', 404)
  }
  if (list.userId !== userId) {
    throw new ListError('Forbidden', 403)
  }
  return list
}

export async function createList(userId: string, input: CreateInput) {
  return listRepository.create({
    name: input.name,
    icon: input.icon,
    color: input.color,
    userId,
  })
}

export async function updateList(userId: string, listId: string, input: UpdateInput) {
  const existing = await listRepository.findById(listId)
  if (!existing) {
    throw new ListError('List not found', 404)
  }
  if (existing.userId !== userId) {
    throw new ListError('Forbidden', 403)
  }

  return listRepository.update(listId, input)
}

export async function deleteList(userId: string, listId: string) {
  const list = await listRepository.findById(listId)
  if (!list) {
    throw new ListError('List not found', 404)
  }
  if (list.userId !== userId) {
    throw new ListError('Forbidden', 403)
  }

  await listRepository.remove(listId)
}
