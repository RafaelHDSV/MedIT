import express from 'express'
import {
  confirmPatientArrival,
  createPatient,
  createPatientAttendance,
  deletePatient,
  editPatient,
  getAttendances,
  getUsers,
  lookupPatientByCpfForStaff,
  updatePatientAttendance
} from '../controllers/patientController.js'
import { UserLevels } from '../interfaces/IUser.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { forbidUserLevelsMiddleware } from '../middlewares/forbidUserLevelsMiddleware.js'

const router = express.Router()

router.post('/', createPatient)
router.get('/', authMiddleware, getUsers)
router.get('/lookup-by-cpf', authMiddleware, lookupPatientByCpfForStaff)
router.put(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  editPatient
)
router.delete(
  '/:id',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  deletePatient
)
router.get(
  '/:id/attendances',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  getAttendances
)
router.post(
  '/attendances/:attendanceId/confirm-arrival',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  confirmPatientArrival
)
router.post(
  '/attendances',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  createPatientAttendance
)
router.put(
  '/attendances/:attendanceId',
  authMiddleware,
  forbidUserLevelsMiddleware(UserLevels.MEDIT),
  updatePatientAttendance
)

export default router
