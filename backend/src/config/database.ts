import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URL))

    console.log('MongoDB conectado com sucesso!')
  } catch (error) {
    console.error('Erro ao conectar no MongoDB', error)
    process.exit(1)
  }
}
