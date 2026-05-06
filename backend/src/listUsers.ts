import mongoose from 'mongoose'
import User from './models/UserModel.js'
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URL =
  'mongodb+srv://rafaelvieira1720_db_user:x7cTgTX1NF5ozKaO@medflow.ubhsw4o.mongodb.net/MEDFLOW_DB'

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('MongoDB conectado')

    const users = await User.find({ level: 'patient' }).limit(5)
    console.log('Pacientes encontrados:')
    users.forEach((u) => {
      console.log(`Email: ${u.email}, CPF: ${u.cpf}, Nome: ${u.name}`)
    })

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

listUsers()
