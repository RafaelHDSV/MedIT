import express from 'express'
import { deleteUser, getUser } from '../controllers/userController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/:id', authMiddleware, getUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router
