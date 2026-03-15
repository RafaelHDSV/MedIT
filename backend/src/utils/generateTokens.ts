import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../globals/Config.js'

const ACCESS_EXPIRES = '15m'
const REFRESH_EXPIRES = '7d'

function generateTokens(userId: ObjectId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: ACCESS_EXPIRES
  })

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRES
  })

  return { accessToken, refreshToken }
}

export default generateTokens
