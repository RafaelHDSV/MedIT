import { Request, Response } from 'express'
import User from '../models/UserModel.js'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password')
  res.json(users)
}

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password')
  res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'Usuário deletado' })
}
