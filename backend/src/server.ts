import cors from 'cors'
import express, { Request, Response } from 'express'

import connectDatabase from './config/database.js'
import { PORT } from './globals/Config.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

await connectDatabase()

app.get('/', (_req: Request, res: Response) => {
  res.send('Back-end funcionando com sucesso!')
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`)
})
