import express from 'express'
import { login, logout, refresh } from '../controllers/authController.js'
import { getSignupUnitsList } from '../controllers/unitController.js'

const router = express.Router()

router.get('/signup/units', getSignupUnitsList)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

export default router
