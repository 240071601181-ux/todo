import type { Request, Response } from 'express'
import { createCategorySchema, updateCategorySchema, categoryParamsSchema } from '../utils/validation.js'
import * as categoryService from '../services/categoryService.js'
import { CategoryError } from '../services/categoryService.js'

export async function list(_req: Request, res: Response) {
  try {
    const categories = await categoryService.listCategories()
    res.json({ categories })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = categoryParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid category ID' })
    return
  }

  try {
    const category = await categoryService.getCategoryById(params.data.id)
    res.json({ category })
  } catch (err) {
    if (err instanceof CategoryError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createCategorySchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }

  try {
    const category = await categoryService.createCategory(parsed.data)
    res.status(201).json({ category })
  } catch (err) {
    if (err instanceof CategoryError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = categoryParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid category ID' })
    return
  }

  const parsed = updateCategorySchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten().fieldErrors })
    return
  }

  try {
    const category = await categoryService.updateCategory(params.data.id, parsed.data)
    res.json({ category })
  } catch (err) {
    if (err instanceof CategoryError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = categoryParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid category ID' })
    return
  }

  try {
    await categoryService.deleteCategory(params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof CategoryError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
