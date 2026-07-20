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

  const updated = await projectRepository.update(projectId, {
    ...input,
    stakeholders: input.stakeholders as Prisma.InputJsonValue | undefined,
    dueDate,
  })

  const changedFields: string[] = []
  if (input.name && input.name !== existing.name) changedFields.push(`renamed to "${input.name}"`)
  if (input.status && input.status !== existing.status) changedFields.push(`status changed to ${input.status}`)
  if (input.progress !== undefined && input.progress !== existing.progress) changedFields.push(`progress updated to ${input.progress}%`)
  if (input.stakeholders) {
    const existingCount = (existing.stakeholders as Array<unknown>).length
    const newCount = input.stakeholders.length
    if (newCount > existingCount) changedFields.push(`${newCount - existingCount} member(s) added`)
    if (newCount < existingCount) changedFields.push(`${existingCount - newCount} member(s) removed`)
  }

  if (changedFields.length > 0) {
    const { generateProjectUpdateNotification } = await import('./notificationService.js')
    await generateProjectUpdateNotification(userId, projectId, updated.name, changedFields.join('; ')).catch(() => {})
  }

  return updated
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
