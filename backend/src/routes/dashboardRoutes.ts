import express from 'express'
import { getDashboardStatusCards } from '../controllers/dashboardController'

const router = express.Router()

router.get('/dashboard-status-cards', getDashboardStatusCards)

export default router
