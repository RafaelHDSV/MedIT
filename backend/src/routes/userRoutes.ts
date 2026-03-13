import express from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.get('/:id', authMiddleware, getUser)
router.put('/:id', authMiddleware, updateUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router
