import NodeCache from 'node-cache'
import type { Request, Response, NextFunction } from 'express'

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 })

export function responseCache(duration: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      next()
      return
    }

    const key = `__cache__${req.originalUrl}`
    const cached = cache.get(key)

    if (cached) {
      res.json(cached)
      return
    }

    const originalJson = res.json.bind(res)
    res.json = (body: unknown) => {
      cache.set(key, body, duration)
      return originalJson(body)
    }

    next()
  }
}

export function clearCache(pattern?: string) {
  if (pattern) {
    const keys = cache.keys().filter((k) => k.includes(pattern))
    keys.forEach((k) => cache.del(k))
  } else {
    cache.flushAll()
  }
}
