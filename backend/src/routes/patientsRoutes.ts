import express from 'express'
import { getUsers } from '../controllers/patientController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)

export default router
