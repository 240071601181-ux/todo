import { Router } from 'express'
import * as projectController from '../controllers/projectController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', projectController.list)
router.get('/:id', projectController.getById)
router.post('/', projectController.create)
router.put('/:id', projectController.update)
router.delete('/:id', projectController.remove)

export default router
