import express from 'express'
import {
  createDoctor,
  deleteDoctor,
  editDoctor,
  getUsers
} from '../controllers/doctorController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, createDoctor)
router.put('/:id', authMiddleware, editDoctor)
router.delete('/:id', authMiddleware, deleteDoctor)

export default router
