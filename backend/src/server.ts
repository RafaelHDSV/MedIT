import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDatabase } from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDatabase()

app.get('/', (req: Request, res: Response) => {
  res.send('API funcionando')
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

app.listen(process.env.PORT, () => {
  console.log('Servidor rodando')
})
