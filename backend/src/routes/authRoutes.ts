import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import * as authController from '../controllers/authController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads', 'avatars'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true)
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'))
    }
  },
})

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', authenticate, authController.getMe)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.put('/profile', authenticate, authController.updateProfile)
router.post('/change-password', authenticate, authController.changePassword)
router.post('/upload-avatar', authenticate, upload.single('avatar'), authController.uploadAvatar)

export default router
