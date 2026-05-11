import express from 'express'
import {
  createDoctor,
  deleteDoctor,
  editDoctor,
  getAttendances,
  getUsers
} from '../controllers/doctorController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { forbidUserLevelsMiddleware } from '../middlewares/forbidUserLevelsMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post(
  '/',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  createDoctor
)
router.put(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  editDoctor
)
router.delete(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  deleteDoctor
)
router.get(
  '/:id/attendances',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  getAttendances
)

export default router
