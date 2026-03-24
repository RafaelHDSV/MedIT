import express from 'express'
import { createPatient, getUsers } from '../controllers/patientController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', createPatient)

export default router
