import express from 'express'
import { createMedication, getMedicationsByUnit } from '../controllers/medicationController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/unit/:unitId', authMiddleware, getMedicationsByUnit)
router.post('/', authMiddleware, createMedication)

export default router
