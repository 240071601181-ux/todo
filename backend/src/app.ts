import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js'
import { requestLogger } from './middleware/logger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { responseCache } from './middleware/cache.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import listRoutes from './routes/listRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import activityRoutes from './routes/activityRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import calendarEventRoutes from './routes/calendarEventRoutes.js'

const app = express()

app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }))
app.use(requestLogger)

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/tasks', globalLimiter, taskRoutes)
app.use('/api/lists', globalLimiter, listRoutes)
app.use('/api/analytics', globalLimiter, responseCache(120), analyticsRoutes)
app.use('/api/activities', globalLimiter, activityRoutes)
app.use('/api/categories', globalLimiter, categoryRoutes)
app.use('/api/tags', globalLimiter, tagRoutes)
app.use('/api/projects', globalLimiter, projectRoutes)
app.use('/api/calendar-events', globalLimiter, calendarEventRoutes)

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.use(errorHandler)

export default app
