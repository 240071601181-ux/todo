import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import listRoutes from './routes/listRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
