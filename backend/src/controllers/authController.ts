import type { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../utils/validation.js'
import * as authService from '../services/authService.js'
import { AuthError } from '../services/authService.js'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const result = await authService.registerUser(parsed.data)
    res.status(201).json(result)
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Register error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const result = await authService.loginUser(parsed.data)
    res.json(result)
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body
  if (!refreshToken || typeof refreshToken !== 'string') {
    res.status(400).json({ message: 'refreshToken is required' })
    return
  }

  try {
    const result = await authService.refreshUserToken(refreshToken)
    res.json(result)
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    console.error('Refresh error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body
  if (!refreshToken || typeof refreshToken !== 'string') {
    res.status(400).json({ message: 'refreshToken is required' })
    return
  }

  try {
    await authService.logoutUser(refreshToken)
    res.json({ message: 'Logged out successfully' })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.id)
    res.json({ user })
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ message: err.message })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
