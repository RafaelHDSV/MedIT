import mongoose from 'mongoose'
import { MONGO_URL } from '../globals/Config.js'

let initPromise: Promise<void> | null = null

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return
  if (initPromise) {
    await initPromise
    return
  }

  initPromise = (async () => {
    try {
      await mongoose.connect(String(MONGO_URL))
      console.log('MongoDB conectado com sucesso!')
    } catch (error) {
      initPromise = null
      console.error('Erro ao conectar no MongoDB', error)
      throw error
    }
  })()

  await initPromise
}

export async function ensureDatabase(): Promise<void> {
  await connectDatabase()
}

export default connectDatabase
