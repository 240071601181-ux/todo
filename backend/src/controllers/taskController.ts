import type { Request, Response } from 'express'
import { createTaskSchema, updateTaskSchema, taskParamsSchema } from '../utils/validation.js'
import * as taskService from '../services/taskService.js'
import { TaskError } from '../services/taskService.js'

export async function list(req: Request, res: Response) {
  try {
    const tasks = await taskService.listTasks(req.user!.id)
    res.json({ tasks })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = taskParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid task ID' })
    return
  }

  try {
    const task = await taskService.getTaskById(req.user!.id, params.data.id)
    res.json({ task })
  } catch (err) {
    if (err instanceof TaskError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const task = await taskService.createTask(req.user!.id, parsed.data)
    res.status(201).json({ task })
  } catch (err) {
    if (err instanceof TaskError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Create task error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = taskParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid task ID' })
    return
  }

  const parsed = updateTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const task = await taskService.updateTask(req.user!.id, params.data.id, parsed.data)
    res.json({ task })
  } catch (err) {
    if (err instanceof TaskError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Update task error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = taskParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid task ID' })
    return
  }

  try {
    await taskService.deleteTask(req.user!.id, params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof TaskError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function toggle(req: Request, res: Response) {
  const params = taskParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid task ID' })
    return
  }

  try {
    const task = await taskService.toggleTask(req.user!.id, params.data.id)
    res.json({ task })
  } catch (err) {
    if (err instanceof TaskError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
