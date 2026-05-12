import express from 'express'
import {
  createUnit,
  editUnit,
  getAllUnits,
  getUnit,
  getUnits
} from '../controllers/unitController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get(
  '/all',
  authMiddleware,
  roleMiddleware(UserLevels.MEDIT),
  getAllUnits
)
router.get('/', authMiddleware, getUnits)
router.get('/:id', authMiddleware, getUnit)
router.post('/', authMiddleware, roleMiddleware(UserLevels.MEDIT), createUnit)
router.put('/:id', authMiddleware, roleMiddleware(UserLevels.MEDIT), editUnit)

export default router
