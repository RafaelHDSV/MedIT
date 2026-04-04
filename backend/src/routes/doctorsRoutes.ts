import express from 'express'
import {
  createDoctor,
  deleteDoctor,
  editDoctor,
  getAttendances,
  getUsers
} from '../controllers/doctorController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, createDoctor)
router.put('/:id', authMiddleware, editDoctor)
router.delete('/:id', authMiddleware, deleteDoctor)
router.get('/:id/attendances', authMiddleware, getAttendances)

export default router
