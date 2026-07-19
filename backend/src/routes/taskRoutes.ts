import { Router } from 'express'
import * as taskController from '../controllers/taskController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', taskController.list)
router.post('/', taskController.create)
router.patch('/:id/toggle', taskController.toggle)
router.delete('/:id', taskController.remove)

export default router
