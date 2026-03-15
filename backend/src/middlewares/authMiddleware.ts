import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../globals/Config.js'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, String(JWT_SECRET))

    req.userId = (decoded as { id: string }).id

    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
