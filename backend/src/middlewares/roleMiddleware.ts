import { NextFunction, Request, Response } from 'express'
import { UserLevels } from '../interfaces/IUser.js'
import User from '../models/UserModel.js'

export const roleMiddleware = (...allowedLevels: UserLevels[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId).select('level')
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Usuário não encontrado na validação de papel' })
      }

      if (!allowedLevels.includes(user.level)) {
        return res.status(403).json({
          message: 'Acesso negado: permissão insuficiente para esta operação'
        })
      }

      next()
    } catch {
      return res.status(500).json({ message: 'Erro na validação de permissão' })
    }
  }
}
