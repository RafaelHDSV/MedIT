import express from 'express'
import {
  createAdmin,
  deleteUser,
  editAdmin,
  getAdmins,
  getUser,
  updateMe
} from '../controllers/userController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get('/admins', authMiddleware, roleMiddleware(UserLevels.MEDIT), getAdmins)
router.post('/admins', authMiddleware, roleMiddleware(UserLevels.MEDIT), createAdmin)
router.put('/admins/:id', authMiddleware, roleMiddleware(UserLevels.MEDIT), editAdmin)

router.get('/:id', authMiddleware, getUser)
router.patch('/me', authMiddleware, updateMe)
router.delete('/:id', authMiddleware, deleteUser)

export default router
