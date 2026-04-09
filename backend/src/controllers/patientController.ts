import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Patient } from '../models/PatientModel.js'
import User from '../models/UserModel.js'
import capitalize from '../utils/capitalize.js'
import normalizeStringArray from '../utils/normalizeStringArray.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find({ level: 'patient' })
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum paciente encontrado' })
  }

  res.json(users)
}

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, cpf, email, password } = req.body

    const errors: Record<string, string> = {}

    if (!name) errors.name = 'Campo obrigatório'
    if (!cpf) errors.cpf = 'Campo obrigatório'
    if (!email) errors.email = 'Campo obrigatório'
    if (!password) errors.password = 'Campo obrigatório'

    if (name && name.length < 3 && name.split(' ').length < 2) {
      errors.name = 'Nome deve conter pelo menos 3 caracteres e sobrenome'
    }

    if (cpf && !/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
      errors.cpf = 'CPF inválido'
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email inválido'
    }
    if (password && password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Erro de validação na criação do paciente',
        errors
      })
    }

    const cleanCpf = cpf.replace(/\D/g, '')
    const cleanEmail = email.trim().toLowerCase()

    const patient = new Patient({
      name,
      cpf: cleanCpf,
      email: cleanEmail,
      password,
      level: UserLevels.PATIENT
    })

    await patient.save()

    res.status(201).json({
      message: 'Paciente criado com sucesso',
      data: patient
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao criar paciente',
      error: error.message
    })
  }
}

export const editPatient = async (req: Request, res: Response) => {
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
      weight,
      height,
      bloodType,
      conditions,
      allergies
    } = req.body

    const errors: Record<string, string> = {}

    if (!name) errors.name = 'Nome é obrigatório'
    if (!cpf) errors.cpf = 'CPF é obrigatório'
    if (!email) errors.email = 'Email é obrigatório'

    if (name && name.length < 3 && name.split(' ').length < 2) {
      errors.name = 'Nome deve conter pelo menos 3 caracteres e sobrenome'
    }

    if (cpf && !/^\d{11}$/.test(cpf.replace(/\D/g, ''))) {
      errors.cpf = 'CPF inválido'
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Email inválido'
    }
    if (currentPassword && currentPassword.length < 6) {
      errors.currentPassword = 'Senha atual deve ter no mínimo 6 caracteres'
    }
    if (newPassword && newPassword.length < 6) {
      errors.newPassword = 'Nova senha deve ter no mínimo 6 caracteres'
    }
    if (
      cellphone &&
      !/^\d{10,11}$/.test(String(cellphone).replace(/\D/g, ''))
    ) {
      errors.cellphone = 'Telefone inválido'
    }

    const patient = await Patient.findById(id)
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' })
    }

    if (currentPassword) {
      const isMatch = await patient.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }
    }

    patient.name = name || patient.name
    patient.cpf = cpf?.replace(/\D/g, '') || patient.cpf
    patient.email = email?.trim().toLowerCase() || patient.email
    if (newPassword) {
      patient.password = newPassword
    }
    patient.gender = gender || patient.gender
    patient.cellphone =
      cellphone !== undefined && cellphone !== null
        ? Number(String(cellphone).replace(/\D/g, ''))
        : patient.cellphone
    patient.birthDate = birthDate || patient.birthDate
    patient.weight = weight || patient.weight
    patient.height = height || patient.height
    patient.bloodType = bloodType || patient.bloodType
    patient.conditions =
      normalizeStringArray(conditions) ||
      normalizeStringArray(patient.conditions)
    patient.allergies =
      normalizeStringArray(allergies) || normalizeStringArray(patient.allergies)

    await patient.save()

    res.status(200).json({
      message: 'Paciente atualizado com sucesso',
      data: patient
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao atualizar paciente',
      error: error.message
    })
  }
}

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const patient = await Patient.findById(id)
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' })
    }

    await patient.deleteOne()

    return res.status(200).json({
      message: 'Paciente deletado com sucesso'
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: 'Erro ao deletar paciente',
      error: error.message
    })
  }
}

export const getAttendances = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const attendances = await Attendance.aggregate([
      { $match: { patientId: new Types.ObjectId(String(id)) } },
      {
        $lookup: {
          from: 'users',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          number: 1,
          name: { $ifNull: ['$patient.name', null] },
          birthDate: { $ifNull: ['$patient.birthDate', null] },
          complaint: 1,
          date: 1,
          risk: 1,
          status: 1,
          unitId: 1,
          patientId: 1,
          nurseId: 1,
          doctorId: 1,
          medicationsIds: 1,
          vitalSigns: 1,
          iaConditionId: 1,
          diagnosis: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ])

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'Nenhum atendimento encontrado' })
    }

    res.json(attendances)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar os atendimentos' })
  }
}
