import express from 'express'
import {
  createMedication,
  editMedication,
  getMedicationsByUnit
} from '../controllers/medicationController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { forbidUserLevelsMiddleware } from '../middlewares/forbidUserLevelsMiddleware.js'

const router = express.Router()

router.get(
  '/unit/:unitId',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  getMedicationsByUnit
)
router.post(
  '/',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  createMedication
)
router.put(
  '/:medicationId',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  editMedication
)

export default router
