import type { Request, Response } from 'express'

export async function list(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export async function create(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export async function toggle(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}

export async function remove(req: Request, res: Response) {
  res.status(501).json({ message: 'Not implemented' })
}
