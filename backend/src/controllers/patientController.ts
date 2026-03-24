import { Request, Response } from 'express'
import { Patient } from '../models/PatientModel.js'
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

export const createPatient = async (req: Request, res: Response) => {
  const { name, cpf, email, password } = req.body

  const errors: Record<string, string> = {}

  if (!name) errors.name = 'Campo obrigatório'
  if (!cpf) errors.cpf = 'Campo obrigatório'
  if (!email) errors.email = 'Campo obrigatório'
  if (!password) errors.password = 'Campo obrigatório'

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ fieldErrors: errors })
  }

  try {
    const existingEmail = await UserModel.findOne({ email })
    if (existingEmail) {
      errors.email = 'Email já cadastrado'
    }

    const existingCpf = await UserModel.findOne({ cpf })
    if (existingCpf) {
      errors.cpf = 'CPF já cadastrado'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Erro ao criar paciente', errors })
    }

    const newUser = new Patient({
      name,
      email,
      cpf,
      password,
      level: 'patient'
    })

    await newUser.save()

    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar paciente', error })
  }
}
