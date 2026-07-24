import { Router } from 'express'
import * as settingsController from '../controllers/settingsController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', settingsController.getSettings)
router.put('/', settingsController.updateSettings)

export default router
