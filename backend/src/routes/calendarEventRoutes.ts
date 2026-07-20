import { Router } from 'express'
import * as calendarEventController from '../controllers/calendarEventController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', calendarEventController.list)
router.get('/:id', calendarEventController.getById)
router.post('/', calendarEventController.create)
router.put('/:id', calendarEventController.update)
router.delete('/:id', calendarEventController.remove)

export default router
