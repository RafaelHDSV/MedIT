import express from 'express'
import {
  claimDoctorConsult,
  claimTriage,
  completeAttendance,
  completeTriage,
  releaseDoctorConsult,
  releaseTriage,
  getStaffAttendanceDetails,
  getSuggestedDiseases,
  getSuggestionDetail
} from '../controllers/attendanceController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/:attendanceId/claim-triage', authMiddleware, claimTriage)
router.post('/:attendanceId/release-triage', authMiddleware, releaseTriage)
router.post('/:attendanceId/complete-triage', authMiddleware, completeTriage)
router.post(
  '/:attendanceId/claim-consultation',
  authMiddleware,
  claimDoctorConsult
)
router.post(
  '/:attendanceId/release-consultation',
  authMiddleware,
  releaseDoctorConsult
)
router.post(
  '/:attendanceId/complete-attendance',
  authMiddleware,
  completeAttendance
)
router.get(
  '/:attendanceId/suggested-diseases',
  authMiddleware,
  getSuggestedDiseases
)
router.get(
  '/:attendanceId/suggestion-detail',
  authMiddleware,
  getSuggestionDetail
)
router.get('/:attendanceId', authMiddleware, getStaffAttendanceDetails)

export default router
