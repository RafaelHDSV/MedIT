import express from 'express'
import {
  getDashboardAttendanceByTime,
  getDashboardAttendanceQueue,
  getDashboardRecentCompletedQueue,
  getDashboardStatusCards
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/status-cards', getDashboardStatusCards)
router.get('/attendance-by-time', getDashboardAttendanceByTime)
router.get('/attendance-queue', getDashboardAttendanceQueue)
router.get('/recent-completed-queue', getDashboardRecentCompletedQueue)

export default router
