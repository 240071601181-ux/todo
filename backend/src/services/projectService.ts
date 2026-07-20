import * as projectRepository from '../repositories/projectRepository.js'
import type { createProjectSchema, updateProjectSchema } from '../utils/validation.js'
import type { z } from 'zod'
import type { Prisma } from '@prisma/client'

type CreateInput = z.infer<typeof createProjectSchema>
type UpdateInput = z.infer<typeof updateProjectSchema>

export class ProjectError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function listProjects(userId: string) {
  return projectRepository.findAllByUser(userId)
}

export async function getProjectById(userId: string, projectId: string) {
  const project = await projectRepository.findById(projectId)
  if (!project) {
    throw new ProjectError('Project not found', 404)
  }
  if (project.userId !== userId) {
    throw new ProjectError('Forbidden', 403)
  }
  return project
}

export async function createProject(userId: string, input: CreateInput) {
  const dueDate = input.dueDate ? new Date(input.dueDate) : null
  return projectRepository.create({
    name: input.name,
    description: input.description,
    color: input.color,
    status: input.status,
    progress: input.progress,
    dueDate,
    category: input.category,
    stakeholders: (input.stakeholders ?? []) as Prisma.InputJsonValue,
    userId,
  })
}

export async function updateProject(userId: string, projectId: string, input: UpdateInput) {
  const existing = await projectRepository.findById(projectId)
  if (!existing) {
    throw new ProjectError('Project not found', 404)
  }
  if (existing.userId !== userId) {
    throw new ProjectError('Forbidden', 403)
  }

  const dueDate = input.dueDate !== undefined
    ? (input.dueDate ? new Date(input.dueDate) : null)
    : undefined

  return projectRepository.update(projectId, {
    ...input,
    stakeholders: input.stakeholders as Prisma.InputJsonValue | undefined,
    dueDate,
  })
}

export async function deleteProject(userId: string, projectId: string) {
  const project = await projectRepository.findById(projectId)
  if (!project) {
    throw new ProjectError('Project not found', 404)
  }
  if (project.userId !== userId) {
    throw new ProjectError('Forbidden', 403)
  }

  await projectRepository.remove(projectId)
}
