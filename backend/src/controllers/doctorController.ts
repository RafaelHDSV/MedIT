import { Request, Response } from 'express'
import { Types } from 'mongoose'
import {
  toCanonicalDiseaseKey,
  toDiseaseLabelPt
} from '../constants/diseaseLabelsPt.js'
import { DoctorSpecializations } from '../interfaces/IDoctor.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Doctor } from '../models/DoctorModel.js'
import User from '../models/UserModel.js'
import { suggestDiseasesFromReportedSymptoms } from '../services/symptomsDiseaseSuggestionService.js'
import capitalize from '../utils/capitalize.js'
import { sanitizeWorkLocationLabel } from '../utils/sanitizeWorkLocationLabel.js'

export const getUsers = async (req: Request, res: Response) => {
  const { unitId } = req.query
  const { userId } = req

  const requester = await User.findById(userId).select('level')
  const isMedit = requester?.level === UserLevels.MEDIT

  if (!isMedit && (!unitId || typeof unitId !== 'string')) {
    return res.status(400).json({ message: 'O ID da unidade é inválido!' })
  }

  const unitFilter: Record<string, unknown> = !isMedit
    ? { unitId: new Types.ObjectId(String(unitId)) }
    : typeof unitId === 'string' &&
        unitId.trim() &&
        Types.ObjectId.isValid(unitId.trim())
      ? { unitId: new Types.ObjectId(unitId.trim()) }
      : {}

  const filter = {
    level: UserLevels.DOCTOR,
    ...unitFilter
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum médico(a) encontrado' })
  }

  res.json({ message: 'Médicos encontrados com sucesso!', data: users })
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
      otherSpecialization,
      workLocationLabel: workLocationLabelRaw
    } = req.body

    const errors: Record<string, string> = {}
    const workLocationLabel = sanitizeWorkLocationLabel(workLocationLabelRaw)

    if (!name) errors.name = 'Nome é obrigatório'
    if (!cpf) errors.cpf = 'CPF é obrigatório'
    if (!email) errors.email = 'Email é obrigatório'
    if (!password) errors.password = 'Senha é obrigatória'
    if (!crm) errors.crm = 'CRM é obrigatório'
    if (!specialization) errors.specialization = 'Especialidade é obrigatória'
    if (!gender) errors.gender = 'Gênero é obrigatório'
    if (!cellphone) errors.cellphone = 'Telefone é obrigatório'
    if (!birthDate) errors.birthDate = 'Data de nascimento é obrigatória'
    if (!workLocationLabel) {
      errors.workLocationLabel =
        'Sala ou consultório é obrigatório (o paciente vê ao iniciar o atendimento).'
    }

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
    if (crm && !/^\d{4,9}$/.test(crm.replace(/\D/g, ''))) {
      errors.crm = 'CRM inválido'
    }
    if (cellphone && !/^\d{10,11}$/.test(cellphone?.replace(/\D/g, ''))) {
      errors.cellphone = 'Telefone inválido'
    }

    const finalSpecialization =
      specialization === DoctorSpecializations.OTHER
        ? otherSpecialization?.toLowerCase()
        : specialization

    if (
      specialization === DoctorSpecializations.OTHER &&
      !otherSpecialization
    ) {
      errors.otherSpecialization = 'Especialidade não listada é obrigatória'
    }
    if (!finalSpecialization) {
      errors.specialization = 'Especialidade inválida'
    }

    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: 'Erro de validações na criação do médico(a)', errors })
    }

    const creator = await User.findById(req.userId).select('unitId')
    const creatorUnitId = creator?.unitId
    if (!creatorUnitId) {
      return res.status(400).json({
        message: 'Erro de validações na criação do médico(a)',
        errors: {
          unitId:
            'Seu usuário não está vinculado a uma unidade; não é possível cadastrar médico(a).'
        }
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
      level: UserLevels.DOCTOR,
      unitId: creatorUnitId,
      workLocationLabel
    })

    await doctor.save()

    return res.status(201).json({
      message: 'Médico(a) criado com sucesso',
      data: doctor
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
      message: 'Erro ao criar médico(a)',
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
      otherSpecialization,
      workLocationLabel: workLocationLabelEditRaw
    } = req.body

    const errors: Record<string, string> = {}
    const workLocationLabelEdit = sanitizeWorkLocationLabel(
      workLocationLabelEditRaw
    )

    if (!name) errors.name = 'Nome é obrigatório'
    if (!cpf) errors.cpf = 'CPF é obrigatório'
    if (!email) errors.email = 'Email é obrigatório'
    if (!crm) errors.crm = 'CRM é obrigatório'
    if (!specialization) errors.specialization = 'Especialidade é obrigatória'
    if (!gender) errors.gender = 'Gênero é obrigatório'
    if (!cellphone) errors.cellphone = 'Telefone é obrigatório'
    if (!birthDate) errors.birthDate = 'Data de nascimento é obrigatória'
    if (!workLocationLabelEdit) {
      errors.workLocationLabel =
        'Sala ou consultório é obrigatório (o paciente vê ao iniciar o atendimento).'
    }

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
    if (crm && !/^\d{4,9}$/.test(crm.replace(/\D/g, ''))) {
      errors.crm = 'CRM inválido'
    }
    if (
      cellphone &&
      !/^\d{10,11}$/.test(String(cellphone)?.replace(/\D/g, ''))
    ) {
      errors.cellphone = 'Telefone inválido'
    }

    const finalSpecialization =
      specialization === DoctorSpecializations.OTHER
        ? otherSpecialization?.toLowerCase()
        : specialization

    const doctor = await Doctor.findById(id)
    if (!doctor) {
      return res.status(404).json({ message: 'Médico(a) não encontrado' })
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
    doctor.workLocationLabel = workLocationLabelEdit

    await doctor.save()

    return res.status(200).json({
      message: 'Médico(a) atualizado com sucesso',
      data: doctor
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
      message: 'Erro ao atualizar médico(a)',
      error: error.message
    })
  }
}

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const doctor = await Doctor.findById(id)
    if (!doctor) {
      return res.status(404).json({ message: 'Médico(a) não encontrado' })
    }

    await doctor.deleteOne()

    return res.status(200).json({
      message: 'Médico(a) deletado com sucesso'
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: 'Erro ao deletar médico(a)',
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
      { $match: { doctorId: new Types.ObjectId(String(id)) } },
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
        const diagnosisKey =
          typeof attendance.diagnosisKey === 'string'
            ? attendance.diagnosisKey.trim()
            : ''
        const diagnosis =
          typeof attendance.diagnosis === 'string'
            ? attendance.diagnosis.trim()
            : ''
        const symptoms = Array.isArray(attendance.symptoms)
          ? attendance.symptoms.filter(
              (s): s is string => typeof s === 'string'
            )
          : []

        if ((!diagnosisKey && !diagnosis) || symptoms.length === 0) {
          return {
            ...attendance,
            iaTopSuggestion: undefined,
            isIaTopSuggestionMatchDiagnosis: false
          }
        }

        const suggestions = await suggestDiseasesFromReportedSymptoms(
          symptoms,
          {
            limit: 1,
            minCompatibility: 1
          }
        )
        const topSuggestion = suggestions[0]?.disease

        return {
          ...attendance,
          iaTopSuggestion: topSuggestion
            ? toDiseaseLabelPt(topSuggestion)
            : undefined,
          isIaTopSuggestionMatchDiagnosis:
            Boolean(topSuggestion) &&
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
