import { Request, Response } from 'express'
import { DoctorSpecializations } from '../interfaces/IDoctor.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Doctor } from '../models/DoctorModel.js'
import UserModel from '../models/UserModel.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.find({ level: 'doctor' })
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum médico encontrado' })
  }

  res.json(users)
}

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const {
      name,
      cpf,
      email,
      password,
      gender,
      cellphone,
      birthDate,
      crm,
      specialization,
      otherSpecialization
    } = req.body

    if (!name || !cpf || !email || !password || !crm || !specialization) {
      return res.status(400).json({ message: 'Dados obrigatórios faltando' })
    }

    const finalSpecialization =
      specialization === DoctorSpecializations.OTHER
        ? otherSpecialization?.toLowerCase()
        : specialization

    if (!finalSpecialization) {
      return res.status(400).json({
        message: 'Especialidade inválida'
      })
    }

    const cleanCpf = cpf.replace(/\D/g, '')
    const cleanEmail = email.trim().toLowerCase()
    const cleanCellphone = cellphone?.replace(/\D/g, '')

    const doctor = new Doctor({
      name,
      cpf: cleanCpf,
      email: cleanEmail,
      password,
      gender,
      cellphone: cleanCellphone,
      birthDate,
      crm,
      specialization: finalSpecialization,
      level: UserLevels.DOCTOR
    })

    await doctor.save()

    return res.status(201).json({
      message: 'Médico criado com sucesso',
      data: doctor
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]

      return res.status(400).json({
        message: `${field} já está em uso`
      })
    }

    return res.status(500).json({
      message: 'Erro ao criar médico',
      error: error.message
    })
  }
}
