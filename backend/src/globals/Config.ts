import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT
export const MONGO_URL = process.env.MONGO_URL
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
