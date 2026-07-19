import type { Request, Response } from 'express'
import { createListSchema, updateListSchema, listParamsSchema } from '../utils/validation.js'
import * as listService from '../services/listService.js'
import { ListError } from '../services/listService.js'

export async function list(req: Request, res: Response) {
  try {
    const lists = await listService.listLists(req.user!.id)
    res.json({ lists })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = listParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid list ID' })
    return
  }

  try {
    const list = await listService.getListById(req.user!.id, params.data.id)
    res.json({ list })
  } catch (err) {
    if (err instanceof ListError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createListSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const list = await listService.createList(req.user!.id, parsed.data)
    res.status(201).json({ list })
  } catch (err) {
    if (err instanceof ListError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Create list error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = listParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid list ID' })
    return
  }

  const parsed = updateListSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const list = await listService.updateList(req.user!.id, params.data.id, parsed.data)
    res.json({ list })
  } catch (err) {
    if (err instanceof ListError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Update list error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = listParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid list ID' })
    return
  }

  try {
    await listService.deleteList(req.user!.id, params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof ListError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
