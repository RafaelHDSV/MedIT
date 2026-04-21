import cors from 'cors'
import express from 'express'
import connectDatabase from './config/database.js'
import { PORT } from './globals/Config.js'
import attendancesRoutes from './routes/attendancesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import doctorsRoutes from './routes/doctorsRoutes.js'
import medicationRoutes from './routes/medicationRoutes.js'
import nursesRoutes from './routes/nursesRoutes.js'
import patientsRoutes from './routes/patientsRoutes.js'
import symptomsDiseasesRoutes from './routes/symptomsDiseasesRoutes.js'
import unitsRoutes from './routes/unitsRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

await connectDatabase()

app.get('/', (_req, res) => {
  res.send('Back-end funcionando com sucesso!')
})

const path = '/auth'

app.use(`${path}`, authRoutes)
app.use(`${path}/users`, usersRoutes)
app.use(`${path}/doctors`, doctorsRoutes)
app.use(`${path}/nurses`, nursesRoutes)
app.use(`${path}/patients`, patientsRoutes)
app.use(`${path}/units`, unitsRoutes)
app.use(`${path}/dashboard`, dashboardRoutes)
app.use(`${path}/attendances`, attendancesRoutes)
app.use(`${path}/medications`, medicationRoutes)
app.use(`${path}/symptoms-diseases`, symptomsDiseasesRoutes)

app.listen(PORT, () => {
  console.log(`Servidor está rodando! ${PORT}`)
})
