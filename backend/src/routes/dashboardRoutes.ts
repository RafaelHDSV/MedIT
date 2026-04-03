import express from 'express'
import {
  getDashboardAttendanceByTime,
  getDashboardAttendanceQueue,
  getDashboardStatusCards
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/status-cards', getDashboardStatusCards)
router.get('/attendance-by-time', getDashboardAttendanceByTime)
router.get('/attendance-queue', getDashboardAttendanceQueue)

export default router
