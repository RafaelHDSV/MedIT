import cors from 'cors'
import express from 'express'
import connectDatabase from './config/database.js'
import { PORT } from './globals/Config.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import doctorsRoutes from './routes/doctorsRoutes.js'
import medicationRoutes from './routes/medicationRoutes.js'
import nursesRoutes from './routes/nursesRoutes.js'
import patientsRoutes from './routes/patientsRoutes.js'
import unitsRoutes from './routes/unitsRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

await connectDatabase()

app.get('/', (_req, res) => {
  res.send('Back-end funcionando com sucesso!')
})

app.use('/auth', authRoutes)
app.use('/auth/users', usersRoutes)
app.use('/auth/doctors', doctorsRoutes)
app.use('/auth/nurses', nursesRoutes)
app.use('/auth/patients', patientsRoutes)
app.use('/auth/units', unitsRoutes)
app.use('/auth/dashboard', dashboardRoutes)
app.use('/auth/medications', medicationRoutes)

app.listen(PORT, () => {
  console.log(`Servidor está rodando! ${PORT}`)
})
