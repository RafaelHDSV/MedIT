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
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', createPatient)
router.get('/', authMiddleware, getUsers)
router.get('/lookup-by-cpf', authMiddleware, lookupPatientByCpfForStaff)
router.put('/:id', authMiddleware, editPatient)
router.delete('/:id', authMiddleware, deletePatient)
router.get('/:id/attendances', authMiddleware, getAttendances)
router.post(
  '/attendances/:attendanceId/confirm-arrival',
  authMiddleware,
  confirmPatientArrival
)
router.post('/attendances', authMiddleware, createPatientAttendance)
router.put(
  '/attendances/:attendanceId',
  authMiddleware,
  updatePatientAttendance
)

export default router
