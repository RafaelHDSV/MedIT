import { Request, Response } from 'express'
import User from '../models/UserModel.js'

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndDelete(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json({ message: 'Usuário deletado' })
}
