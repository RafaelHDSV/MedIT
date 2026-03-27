import express from 'express'
import {
  createPatient,
  deletePatient,
  editPatient,
  getUsers
} from '../controllers/patientController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', createPatient)

router.get('/', authMiddleware, getUsers)
router.put('/:id', authMiddleware, editPatient)
router.delete('/:id', authMiddleware, deletePatient)

export default router
