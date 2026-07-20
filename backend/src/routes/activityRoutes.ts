import { Router } from 'express'
import * as activityController from '../controllers/activityController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', activityController.getActivities)

export default router
