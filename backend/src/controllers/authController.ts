import type { Request, Response } from 'express'

export async function register(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export async function login(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export async function getProfile(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}
