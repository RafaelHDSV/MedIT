import express from 'express'
import { getAllUnits, getUnit, createUnit } from '../controllers/unitController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getAllUnits)
router.get('/:id', authMiddleware, getUnit)
router.post('/', authMiddleware, createUnit)

export default router
