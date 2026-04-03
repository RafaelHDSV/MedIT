import express from 'express'
import { getUnit } from '../controllers/unitController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/:id', authMiddleware, getUnit)

export default router
