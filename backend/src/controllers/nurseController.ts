import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { NurseShifts } from '../interfaces/INurse.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Nurse } from '../models/NurseModel.js'
import { suggestDiseasesFromReportedSymptoms } from '../services/symptomsDiseaseSuggestionService.js'
import { toCanonicalDiseaseKey } from '../constants/diseaseLabelsPt.js'
import User from '../models/UserModel.js'
import capitalize from '../utils/capitalize.js'

export const getUsers = async (req: Request, res: Response) => {
  const { unitId } = req.query
  if (!unitId || typeof unitId !== 'string') {
    return res.status(400).json({ message: 'O ID da unidade é inválido!' })
  }

  const users = await User.find({
    level: UserLevels.NURSE,
    unitId: new Types.ObjectId(unitId)
  } as any)
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhuma enfermeiro(a) encontrada' })
  }

  res.json({ message: 'Enfermeiros encontrados com sucesso!', data: users })
}

export const createNurse = async (req: Request, res: Response) => {
  try {
    const {
      name,
      cpf,
      email,
      password,
      gender,
      cellphone,
      birthDate,
      coren,
      shift
    } = req.body

    const errors: Record<string, string> = {}

    if (!name) errors.name = 'Nome é obrigatório'
    if (!cpf) errors.cpf = 'CPF é obrigatório'
    if (!email) errors.email = 'Email é obrigatório'
    if (!password) errors.password = 'Senha é obrigatória'
    if (!coren) errors.coren = 'COREN é obrigatório'
    if (!shift) errors.shift = 'Turno é obrigatório'
    if (!gender) errors.gender = 'Gênero é obrigatório'
    if (!cellphone) errors.cellphone = 'Telefone é obrigatório'
    if (!birthDate) errors.birthDate = 'Data de nascimento é obrigatória'

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
    if (coren && !/^\d{4,9}$/.test(coren.replace(/\D/g, ''))) {
      errors.coren = 'COREN inválido'
    }
    if (shift && !Object.values(NurseShifts).includes(shift)) {
      errors.shift = 'Turno inválido'
    }
    if (cellphone && !/^\d{10,11}$/.test(cellphone?.replace(/\D/g, ''))) {
      errors.cellphone = 'Telefone inválido'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Erro de validação na criação do enfermeiro(a)',
        errors
      })
    }

    const creator = await User.findById(req.userId).select('unitId')
    const creatorUnitId = creator?.unitId
    if (!creatorUnitId) {
      return res.status(400).json({
        message: 'Erro de validação na criação do enfermeiro(a)',
        errors: {
          unitId:
            'Seu usuário não está vinculado a uma unidade; não é possível cadastrar enfermeiro(a).'
        }
      })
    }

    const cleanCpf = cpf.replace(/\D/g, '')
    const cleanEmail = email.trim().toLowerCase()
    const cleanCellphone = Number(String(cellphone)?.replace(/\D/g, ''))

    const nurse = new Nurse({
      name,
      cpf: cleanCpf,
      email: cleanEmail,
      password,
      gender,
      cellphone: cleanCellphone,
      birthDate,
      coren,
      shift,
      level: UserLevels.NURSE,
      unitId: creatorUnitId
    })

    await nurse.save()

    res.status(201).json({
      message: 'Enfermeiro(a) criado com sucesso',
      data: nurse
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: 'Campos inválidos',
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao criar enfermeiro(a)',
      error: error.message
    })
  }
}

export const editNurse = async (req: Request, res: Response) => {
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
      coren,
      shift
    } = req.body

    const errors: Record<string, string> = {}

    if (!name) errors.name = 'Nome é obrigatório'
    if (!cpf) errors.cpf = 'CPF é obrigatório'
    if (!email) errors.email = 'Email é obrigatório'
    if (!coren) errors.coren = 'COREN é obrigatório'
    if (!shift) errors.shift = 'Turno é obrigatório'
    if (!gender) errors.gender = 'Gênero é obrigatório'
    if (!cellphone) errors.cellphone = 'Telefone é obrigatório'
    if (!birthDate) errors.birthDate = 'Data de nascimento é obrigatória'

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
    if (coren && !/^\d{4,9}$/.test(coren.replace(/\D/g, ''))) {
      errors.coren = 'COREN inválido'
    }
    if (shift && !Object.values(NurseShifts).includes(shift)) {
      errors.shift = 'Turno inválido'
    }
    if (
      cellphone &&
      !/^\d{10,11}$/.test(String(cellphone).replace(/\D/g, ''))
    ) {
      errors.cellphone = 'Telefone inválido'
    }

    const nurse = await Nurse.findById(id)
    if (!nurse) {
      return res.status(404).json({ message: 'Enfermeiro(a) não encontrada' })
    }
    if (currentPassword) {
      const isMatch = await nurse.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }
    }

    nurse.name = name || nurse.name
    nurse.cpf = cpf?.replace(/\D/g, '') || nurse.cpf
    nurse.email = email?.trim().toLowerCase() || nurse.email
    if (newPassword) nurse.password = newPassword
    nurse.gender = gender || nurse.gender
    nurse.cellphone =
      cellphone !== undefined && cellphone !== null
        ? Number(String(cellphone).replace(/\D/g, ''))
        : nurse.cellphone
    nurse.birthDate = birthDate || nurse.birthDate
    nurse.coren = coren || nurse.coren
    nurse.shift = shift || nurse.shift

    await nurse.save()

    return res.json({
      message: 'Enfermeiro(a) atualizado com sucesso',
      data: nurse
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: 'Campos inválidos',
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao atualizar enfermeiro(a)',
      error: error.message
    })
  }
}

export const deleteNurse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const nurse = await Nurse.findById(id)
    if (!nurse) {
      return res.status(404).json({ message: 'Enfermeiro(a) não encontrado' })
    }

    await nurse.deleteOne()

    return res.status(200).json({
      message: 'Enfermeiro(a) deletado com sucesso'
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: 'Erro ao deletar enfermeiro(a)',
      error: error.message
    })
  }
}

export const getAttendances = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const attendances = await Attendance.aggregate<{
      _id: Types.ObjectId
      diagnosisKey?: string
      diagnosis?: string
      symptoms?: string[]
      [key: string]: unknown
    }>([
      { $match: { nurseId: new Types.ObjectId(String(id)) } },
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
          painLevel: 1,
          selfMedicated: 1,
          symptomStartDate: 1,
          symptoms: 1,
          generalObservation: 1,
          conditions: 1,
          allergies: 1,
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
          diagnosisKey: 1,
          diagnosis: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ])

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'Nenhum atendimento encontrado' })
    }

    const enrichedAttendances = await Promise.all(
      attendances.map(async (attendance) => {
        const diagnosisKey = typeof attendance.diagnosisKey === 'string'
          ? attendance.diagnosisKey.trim()
          : ''
        const diagnosis = typeof attendance.diagnosis === 'string'
          ? attendance.diagnosis.trim()
          : ''
        const symptoms = Array.isArray(attendance.symptoms)
          ? attendance.symptoms.filter((s): s is string => typeof s === 'string')
          : []

        if ((!diagnosisKey && !diagnosis) || symptoms.length === 0) {
          return {
            ...attendance,
            iaTopSuggestion: undefined,
            isIaTopSuggestionMatchDiagnosis: false
          }
        }

        const suggestions = await suggestDiseasesFromReportedSymptoms(symptoms, {
          limit: 1,
          minCompatibility: 1
        })
        const topSuggestion = suggestions[0]?.disease

        return {
          ...attendance,
          iaTopSuggestion: topSuggestion,
          isIaTopSuggestionMatchDiagnosis: Boolean(topSuggestion) &&
            toCanonicalDiseaseKey(topSuggestion) ===
              toCanonicalDiseaseKey(diagnosisKey || diagnosis)
        }
      })
    )

    res.json({
      message: 'Atendimentos encontrados com sucesso!',
      data: enrichedAttendances
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar os atendimentos' })
  }
}
