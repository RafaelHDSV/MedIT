import express from 'express'
import {
  deleteUser,
  getUser,
  getUsers,
  getUsersByRole,
  updateUser
} from '../controllers/userController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.get('/role/:role', authMiddleware, getUsersByRole)
router.get('/:id', authMiddleware, getUser)
router.put('/:id', authMiddleware, updateUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router
