import type { Request, Response } from 'express'
import { createProjectSchema, updateProjectSchema, projectParamsSchema } from '../utils/validation.js'
import * as projectService from '../services/projectService.js'
import { ProjectError } from '../services/projectService.js'

export async function list(req: Request, res: Response) {
  try {
    const projects = await projectService.listProjects(req.user!.id)
    res.json({ projects })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getById(req: Request, res: Response) {
  const params = projectParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid project ID' })
    return
  }

  try {
    const project = await projectService.getProjectById(req.user!.id, params.data.id)
    res.json({ project })
  } catch (err) {
    if (err instanceof ProjectError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  const parsed = createProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const project = await projectService.createProject(req.user!.id, parsed.data)
    res.status(201).json({ project })
  } catch (err) {
    if (err instanceof ProjectError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Create project error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  const params = projectParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid project ID' })
    return
  }

  const parsed = updateProjectSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const project = await projectService.updateProject(req.user!.id, params.data.id, parsed.data)
    res.json({ project })
  } catch (err) {
    if (err instanceof ProjectError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Update project error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const params = projectParamsSchema.safeParse(req.params)
  if (!params.success) {
    res.status(400).json({ message: 'Invalid project ID' })
    return
  }

  try {
    await projectService.deleteProject(req.user!.id, params.data.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof ProjectError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
