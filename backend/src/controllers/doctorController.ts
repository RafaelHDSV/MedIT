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

export const editDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const {
      name,
      cpf,
      email,
      currentPassword,
      newPassword,
      gender,
      cellphone,
      birthDate,
      crm,
      specialization,
      otherSpecialization
    } = req.body

    const finalSpecialization =
      specialization === DoctorSpecializations.OTHER
        ? otherSpecialization?.toLowerCase()
        : specialization

    const doctor = await Doctor.findById(id)
    if (!doctor) {
      return res.status(404).json({ message: 'Médico não encontrado' })
    }

    if (currentPassword) {
      const isMatch = await doctor.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }
    }

    doctor.name = name || doctor.name
    doctor.cpf = cpf?.replace(/\D/g, '') || doctor.cpf
    doctor.email = email?.trim().toLowerCase() || doctor.email
    if (newPassword) doctor.password = newPassword
    doctor.gender = gender || doctor.gender
    doctor.cellphone =
      Number(String(cellphone)?.replace(/\D/g, '')) || doctor.cellphone
    doctor.birthDate = birthDate || doctor.birthDate
    doctor.crm = crm || doctor.crm
    doctor.specialization = finalSpecialization || doctor.specialization

    await doctor.save()

    return res.status(200).json({
      message: 'Médico atualizado com sucesso',
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
      message: 'Erro ao atualizar médico',
      error: error.message
    })
  }
}

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const doctor = await Doctor.findById(id)
    if (!doctor) {
      return res.status(404).json({ message: 'Médico não encontrado' })
    }

    await doctor.deleteOne()

    return res.status(200).json({
      message: 'Médico deletado com sucesso'
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Erro ao deletar médico',
      error: error.message
    })
  }
}

