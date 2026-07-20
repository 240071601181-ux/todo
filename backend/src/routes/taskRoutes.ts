import { Router } from 'express'
import * as taskController from '../controllers/taskController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', taskController.list)
router.get('/:id', taskController.getById)
router.post('/', taskController.create)
router.put('/:id', taskController.update)
router.patch('/:id/complete', taskController.toggle)
router.patch('/:id/archive', taskController.archive)
router.patch('/:id/restore', taskController.restore)
router.patch('/:id/reorder', taskController.reorder)
router.delete('/:id', taskController.remove)

export default router
