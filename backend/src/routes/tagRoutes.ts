import { Router } from 'express'
import * as tagController from '../controllers/tagController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', tagController.list)
router.get('/:id', tagController.getById)
router.post('/', tagController.create)
router.put('/:id', tagController.update)
router.delete('/:id', tagController.remove)

export default router
