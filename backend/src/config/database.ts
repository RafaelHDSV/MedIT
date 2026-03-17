import mongoose from 'mongoose'
import { MONGO_URL } from '../globals/Config.js'

async function connectDatabase() {
  try {
    await mongoose.connect(String(MONGO_URL))

    console.log('MongoDB conectado com sucesso!')
  } catch (error) {
    console.error('Erro ao conectar no MongoDB', error)
    process.exit(1)
  }
}

export default connectDatabase