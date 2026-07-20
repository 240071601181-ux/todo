import { Router } from 'express'
import * as notificationController from '../controllers/notificationController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', notificationController.list)
router.get('/unread-count', notificationController.getUnreadCount)
router.patch('/:id/read', notificationController.markRead)
router.patch('/read-all', notificationController.markAllRead)
router.post('/generate', notificationController.generate)

export default router
