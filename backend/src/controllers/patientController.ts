import { Request, Response } from 'express'
import UserModel from '../models/UserModel.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find({ level: 'patient' })
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum paciente encontrado' })
  }

  res.json(users)
}
