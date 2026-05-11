import express from 'express'
import {
  createNurse,
  deleteNurse,
  editNurse,
  getAttendances,
  getUsers
} from '../controllers/nurseController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { forbidUserLevelsMiddleware } from '../middlewares/forbidUserLevelsMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post(
  '/',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  createNurse
)
router.put(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  editNurse
)
router.delete(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  deleteNurse
)
router.get(
  '/:id/attendances',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  getAttendances
)

export default router
