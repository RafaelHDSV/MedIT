import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../globals/Config.js'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token mal formatado' })
  }

  try {
    const decoded = jwt.verify(token, String(JWT_SECRET)) as { userId: string }

    req.userId = decoded.userId

    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
