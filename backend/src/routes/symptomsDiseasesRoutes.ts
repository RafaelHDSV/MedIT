import express from 'express'
import {
  getDiseaseOptions,
  getSymptomOptions
} from '../controllers/symptomsDiseasesController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/symptom-options', authMiddleware, getSymptomOptions)
router.get('/disease-options', authMiddleware, getDiseaseOptions)

export default router
