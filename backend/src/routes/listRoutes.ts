import { Router } from 'express'
import * as listController from '../controllers/listController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.use(authenticate)

router.get('/', listController.list)
router.get('/:id', listController.getById)
router.post('/', listController.create)
router.put('/:id', listController.update)
router.delete('/:id', listController.remove)

export default router
