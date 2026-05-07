import express from 'express'
import { deleteUser, getUser, updateMe } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/:id', authMiddleware, getUser)
router.patch('/me', authMiddleware, updateMe)
router.delete('/:id', authMiddleware, deleteUser)

export default router
