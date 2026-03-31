import express from 'express'
import {
  getDashboardAttendanceByTime,
  getDashboardStatusCards
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/dashboard-status-cards', getDashboardStatusCards)
router.get('/dashboard-attendance-by-time', getDashboardAttendanceByTime)

export default router
