import type { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function errorHandler(
  err: Error & { status?: number; details?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500
  const message = status === 500 ? 'Internal server error' : err.message

  if (status === 500) {
    console.error('[ERROR]', err)
  }

  res.status(status).json({
    message,
    ...(err.details ? { details: err.details } : {}),
  })
}
