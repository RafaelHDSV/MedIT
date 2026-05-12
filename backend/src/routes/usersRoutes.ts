import express from 'express'
import {
  createAdmin,
  deleteAdmin,
  deleteUser,
  editAdmin,
  getAdmins,
  getUser,
  updateMe
} from '../controllers/userController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { forbidUserLevelsMiddleware } from '../middlewares/forbidUserLevelsMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
  '/admins',
  authMiddleware,
  roleMiddleware(UserLevels.MEDIT),
  getAdmins
)
router.post(
  '/admins',
  authMiddleware,
  roleMiddleware(UserLevels.MEDIT),
  createAdmin
)
router.put(
  '/admins/:id',
  authMiddleware,
  roleMiddleware(UserLevels.MEDIT),
  editAdmin
)
router.delete(
  '/admins/:id',
  authMiddleware,
  roleMiddleware(UserLevels.MEDIT),
  deleteAdmin
)

router.patch('/me', authMiddleware, updateMe)
router.delete(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  deleteUser
)
router.get('/:id', authMiddleware, getUser)

export default router
