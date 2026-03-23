import express from 'express'
import { createDoctor, getUsers } from '../controllers/doctorController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)
router.post('/', authMiddleware, createDoctor)

export default router
