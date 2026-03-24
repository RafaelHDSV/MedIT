import express from 'express'
import { login, logout, refresh } from '../controllers/authController.js'

const router = express.Router()

router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

export default router
