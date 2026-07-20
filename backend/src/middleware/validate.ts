import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

interface ValidationSchemas {
  body?: ZodSchema
  params?: ZodSchema
  query?: ZodSchema
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body)
        if (!result.success) {
          res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors,
          })
          return
        }
        req.body = result.data
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params)
        if (!result.success) {
          res.status(400).json({
            message: 'Invalid parameters',
            errors: result.error.flatten().fieldErrors,
          })
          return
        }
        req.params = result.data
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query)
        if (!result.success) {
          res.status(400).json({
            message: 'Invalid query parameters',
            errors: result.error.flatten().fieldErrors,
          })
          return
        }
        req.query = result.data
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
