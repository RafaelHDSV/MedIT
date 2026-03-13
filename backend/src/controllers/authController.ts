import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../models/User.js"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" })
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return res.status(400).json({ message: "Senha inválida" })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  )

  return res.json({
    token,
    user
  })
}