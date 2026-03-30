import express from 'express'
import { getUnit } from '../controllers/unitController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/:id', authMiddleware, getUnit)

export default router
