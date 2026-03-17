import { Request, Response } from 'express'
import User from '../models/UserModel.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password')
  if (!users) {
    return res.status(404).json({ message: 'Nenhum usuário encontrado' })
  }

  res.json(users)
}

export const getUsersByRole = async (req: Request, res: Response) => {
  const { role } = req.params
  const users = await User.find({ role: String(role).toUpperCase() }).select(
    '-password'
  )
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum usuário encontrado' })
  }

  res.json(users)
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findById(id).select('-password')
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true
  })
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
