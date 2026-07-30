import rateLimit from 'express-rate-limit'
import type { Options } from 'express-rate-limit'

const isProduction = process.env.NODE_ENV === 'production'

const limits = {
  global: {
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 1000,
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 10 : 1000,
  },
} as const

function createLimiter(config: { windowMs: number; max: number }): ReturnType<typeof rateLimit> {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
  })
}

export const globalLimiter = createLimiter(limits.global)

export const authLimiter = createLimiter(limits.auth)
