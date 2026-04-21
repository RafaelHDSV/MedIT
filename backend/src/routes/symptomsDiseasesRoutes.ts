import express from 'express'
import { getSymptomOptions } from '../controllers/symptomsDiseasesController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/symptom-options', authMiddleware, getSymptomOptions)

export default router
