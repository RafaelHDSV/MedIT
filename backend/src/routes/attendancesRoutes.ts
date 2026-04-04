import express from 'express'
import { getAttendances } from '../controllers/attendanceController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getAttendances)

export default router
