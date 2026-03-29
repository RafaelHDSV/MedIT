import express from 'express'
import {
  createNurse,
  deleteNurse,
  editNurse,
  getUsers
} from '../controllers/nurseController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, createNurse)
router.put('/:id', authMiddleware, editNurse)
router.delete('/:id', authMiddleware, deleteNurse)

export default router
