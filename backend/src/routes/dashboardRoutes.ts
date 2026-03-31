import express from 'express'
import { getDashboardStatusCards } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/dashboard-status-cards', getDashboardStatusCards)

export default router
