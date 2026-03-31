import express from 'express'
import {
  getDashboardAttendanceByTime,
  getDashboardStatusCards
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/status-cards', getDashboardStatusCards)
router.get('/attendance-by-time', getDashboardAttendanceByTime)

export default router
