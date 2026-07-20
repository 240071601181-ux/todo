import morgan from 'morgan'
import type { Request, Response } from 'express'

morgan.token('body', (req: Request) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const body = { ...req.body }
    if (body.password) body.password = '[REDACTED]'
    if (body.token) body.token = '[REDACTED]'
    if (body.refreshToken) body.refreshToken = '[REDACTED]'
    return JSON.stringify(body)
  }
  return ''
})

export const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
  {
    skip: (_req: Request, res: Response) => res.statusCode < 400,
  }
)

export const accessLogger = morgan('combined')
