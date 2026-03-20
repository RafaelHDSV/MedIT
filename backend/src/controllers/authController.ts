import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../globals/Config.js'
import User from '../models/UserModel.js'
import generateTokens from '../utils/generateTokens.js'

// /register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, cpf, level, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' })
    }

    const user = await User.create({
      name,
      cpf,
      level,
      email,
      password
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
}

// /login
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

  const { accessToken, refreshToken } = generateTokens(user._id)
  user.refreshToken = refreshToken
  await user.save()

  return res.json({
    accessToken,
    refreshToken,
    user
  })
}

// /refresh
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token inválido' })
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as any

    const user = await User.findById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Token inválido' })
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET!, {
      expiresIn: '15m'
    })

    return res.json({ accessToken })
  } catch {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

// /logout
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  const user = await User.findOne({ refreshToken })

  if (user) {
    user.refreshToken = undefined
    await user.save()
  }

  res.json({ message: 'Logout realizado' })
}
