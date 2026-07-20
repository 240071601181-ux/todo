import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(2000).optional(),
  priority: z.number().int().min(0).max(5).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  listId: z.string().uuid('Invalid list ID'),
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional().nullable(),
  priority: z.number().int().min(0).max(5).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  listId: z.string().uuid('Invalid list ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
})

export const taskParamsSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
})

export const listParamsSchema = z.object({
  id: z.string().uuid('Invalid list ID'),
})

export const createListSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
})

export const updateListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().max(50).optional().nullable(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
})
