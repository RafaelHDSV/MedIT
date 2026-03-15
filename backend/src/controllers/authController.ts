import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../globals/Config.js'
import User from '../models/UserModel.js'

export const register = async (req: Request, res: Response) => {
  try {
    const { name, cpf, role, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' })
    }

    const user = await User.create({
      name,
      cpf,
      role,
      email,
      password
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, cpf, password } = req.body

  let user = null
  if (email) {
    user = await User.findOne({ email })
  } else if (cpf) {
    user = await User.findOne({ cpf })
  }

  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' })
  }

  const validPassword = await user.comparePassword(password)

  if (!validPassword) {
    return res.status(400).json({ message: 'Senha inválida' })
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
    expiresIn: '1d'
  })

  return res.json({
    token,
    user
  })
}
