import express from 'express'
import {
  claimDoctorConsult,
  claimTriage,
  completeTriage
} from '../controllers/attendanceController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/:attendanceId/claim-triage', authMiddleware, claimTriage)
router.post('/:attendanceId/complete-triage', authMiddleware, completeTriage)
router.post(
  '/:attendanceId/claim-consultation',
  authMiddleware,
  claimDoctorConsult
)

export default router
