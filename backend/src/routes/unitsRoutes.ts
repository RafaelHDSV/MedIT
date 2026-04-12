import express from 'express'
import { createUnit, getUnit, getUnits } from '../controllers/unitController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getUnits)
router.get('/:id', authMiddleware, getUnit)
router.post('/', authMiddleware, createUnit)

export default router
