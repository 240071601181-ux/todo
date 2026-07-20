import type { Request, Response } from 'express'
import { createTagSchema, updateTagSchema, tagParamsSchema } from '../utils/validation.js'
import * as tagService from '../services/tagService.js'
import { TagError } from '../services/tagService.js'

export async function list(_req: Request, res: Response) {
  try {
    const tags = await tagService.listTags()
    res.json({ tags })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = tagParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid tag ID' })
    return
  }

  try {
    const tag = await tagService.getTagById(params.data.id)
    res.json({ tag })
  } catch (err) {
    if (err instanceof TagError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createTagSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }

  try {
    const tag = await tagService.createTag(parsed.data)
    res.status(201).json({ tag })
  } catch (err) {
    if (err instanceof TagError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = tagParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid tag ID' })
    return
  }

  const parsed = updateTagSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }

  try {
    const tag = await tagService.updateTag(params.data.id, parsed.data)
    res.json({ tag })
  } catch (err) {
    if (err instanceof TagError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = tagParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid tag ID' })
    return
  }

  try {
    await tagService.deleteTag(params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof TagError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
