import express from 'express'
import { getUsers } from '../controllers/doctorController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUsers)

export default router
