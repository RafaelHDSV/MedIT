import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

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
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET))

    req.userId = (decoded as { id: string }).id

    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
