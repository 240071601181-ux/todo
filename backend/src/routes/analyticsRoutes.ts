import { Router } from 'express'
import * as analyticsController from '../controllers/analyticsController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', analyticsController.getAnalytics)

export default router
