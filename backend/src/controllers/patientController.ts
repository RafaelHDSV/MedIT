import { Request, Response } from 'express'
import { Types } from 'mongoose'
import {
  AttendanceRisk,
  AttendanceStatus
} from '../interfaces/IAttendance.js'
import { UserGender, UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Patient } from '../models/PatientModel.js'
import { Unit } from '../models/UnitModel.js'
import User from '../models/UserModel.js'
import capitalize from '../utils/capitalize.js'
import normalizeStringArray from '../utils/normalizeStringArray.js'

const provisionalRiskFromPain = (pain: number): AttendanceRisk => {
  if (pain >= 9) return AttendanceRisk.VERY_URGENT
  if (pain >= 7) return AttendanceRisk.URGENT
  if (pain >= 4) return AttendanceRisk.LESS_URGENT
  return AttendanceRisk.NOT_URGENT
}

const buildPreRegistrationComplaint = ({
  mainComplaint,
  painLevel,
  selfMedicated,
  symptomStartDate,
  symptoms,
  conditions,
  allergies,
  generalObservation
}: {
  mainComplaint: string
  painLevel: number
  selfMedicated: boolean
  symptomStartDate: string
  symptoms: string[]
  conditions: string[]
  allergies: string[]
  generalObservation?: string
}) => {
  const lines = [
    `Queixa principal: ${mainComplaint.trim()}`,
    `Nível de dor (0–10): ${painLevel}`,
    `Automedicou-se: ${selfMedicated ? 'Sim' : 'Não'}`,
    `Início dos sintomas: ${symptomStartDate}`,
    symptoms.length
      ? `Sintomas informados: ${symptoms.join(', ')}`
      : 'Sintomas informados: (nenhum selecionado)',
    conditions.length
      ? `Condições médicas: ${conditions.join(', ')}`
      : undefined,
    allergies.length ? `Alergias: ${allergies.join(', ')}` : undefined,
    generalObservation?.trim()
      ? `Observação geral: ${generalObservation.trim()}`
      : undefined
  ].filter(Boolean) as string[]

  return lines.join('\n')
}

export const getUsers = async (req: Request, res: Response) => {
  const { unitId } = req.query
  if (!unitId || typeof unitId !== 'string') {
    return res.status(400).json({ message: 'O ID da unidade é inválido!' })
  }

  const users = await User.find({
    level: UserLevels.PATIENT,
    unitId: new Types.ObjectId(unitId)
  } as any)
    .sort({ createdAt: -1 })
    .select('-password')
  if (!users || users.length === 0) {
    return res.status(404).json({ message: 'Nenhum paciente encontrado' })
  }

  res.json({ message: 'Pacientes encontrados com sucesso!', data: users })
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
        message: 'Campos inválidos',
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
        message: 'Campos inválidos',
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

    res.json({
      message: 'Atendimentos encontrados com sucesso!',
      data: attendances
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar os atendimentos' })
  }
}

export const listHealthUnitsForPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.PATIENT) {
      return res.status(403).json({
        message: 'Você não tem permissão para listar unidades por esta rota.'
      })
    }

    const units = await Unit.find()
      .select('_id name')
      .sort({ name: 1 })
      .lean()

    return res.status(200).json({
      message: 'Unidades encontradas com sucesso!',
      data: units
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidades de saúde' })
  }
}

export const createPatientAttendance = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.userId)
    if (!patient || patient.level !== UserLevels.PATIENT) {
      return res.status(403).json({
        message: 'Apenas pacientes podem solicitar atendimento por esta rota.'
      })
    }

    const {
      mainComplaint,
      painLevel,
      selfMedicated,
      symptomStartDate,
      conditions,
      allergies,
      generalObservation,
      symptoms,
      birthDate,
      gender,
      unitId: bodyUnitId
    } = req.body as {
      mainComplaint?: string
      painLevel?: number
      selfMedicated?: boolean
      symptomStartDate?: string
      conditions?: string | string[]
      allergies?: string | string[]
      generalObservation?: string
      symptoms?: string[]
      birthDate?: string
      gender?: string
      unitId?: string
    }

    const errors: Record<string, string> = {}

    if (!mainComplaint?.trim()) {
      errors.mainComplaint = 'Informe sua queixa principal'
    }
    if (painLevel === undefined || painLevel === null || Number.isNaN(painLevel)) {
      errors.painLevel = 'Informe seu nível de dor'
    }
    if (selfMedicated === undefined || selfMedicated === null) {
      errors.selfMedicated = 'Informe se você se automedicou'
    }
    if (!symptomStartDate) {
      errors.symptomStartDate = 'Informe quando os sintomas começaram'
    }

    const unitIdStr =
      (typeof bodyUnitId === 'string' && bodyUnitId.trim()) ||
      (patient.unitId ? String(patient.unitId) : '')

    if (!unitIdStr || !Types.ObjectId.isValid(unitIdStr)) {
      errors.unitId = 'Selecione a unidade de saúde onde deseja ser atendido(a).'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Corrija os campos obrigatórios antes de continuar.',
        errors
      })
    }

    const unit = await Unit.findById(unitIdStr)
    if (!unit) {
      return res.status(400).json({
        message: 'Unidade de saúde não encontrada.',
        errors: { unitId: 'Unidade inválida' }
      })
    }

    const symptomStart = new Date(symptomStartDate!)
    if (Number.isNaN(symptomStart.getTime())) {
      return res.status(400).json({
        message: 'Data de início dos sintomas inválida.',
        errors: { symptomStartDate: 'Data inválida' }
      })
    }

    const normalizedSymptoms = Array.isArray(symptoms)
      ? symptoms.map((s) => String(s).trim()).filter(Boolean)
      : []

    const normalizedConditions = normalizeStringArray(conditions)
    const normalizedAllergies = normalizeStringArray(allergies)

    if (birthDate) {
      const bd = new Date(birthDate)
      if (!Number.isNaN(bd.getTime())) {
        patient.birthDate = bd
      }
    }

    if (gender && Object.values(UserGender).includes(gender as UserGender)) {
      patient.gender = gender as UserGender
    }

    if (conditions !== undefined && conditions !== null) {
      patient.conditions = normalizedConditions
    }
    if (allergies !== undefined && allergies !== null) {
      patient.allergies = normalizedAllergies
    }

    if (!patient.unitId) {
      patient.set('unitId', new Types.ObjectId(unitIdStr))
    }

    await patient.save()

    const complaint = buildPreRegistrationComplaint({
      mainComplaint: mainComplaint!.trim(),
      painLevel: Number(painLevel),
      selfMedicated: Boolean(selfMedicated),
      symptomStartDate: symptomStart.toLocaleDateString('pt-BR'),
      symptoms: normalizedSymptoms,
      conditions: normalizedConditions,
      allergies: normalizedAllergies,
      generalObservation
    })

    const risk = provisionalRiskFromPain(Number(painLevel))
    const now = new Date()

    const numberAgg = await Attendance.aggregate<{ max: number | null }>([
      { $group: { _id: null, max: { $max: '$number' } } }
    ])
    const nextNumber = (numberAgg[0]?.max ?? 0) + 1

    const attendance = await Attendance.create({
      number: nextNumber,
      complaint,
      date: now,
      risk,
      status: AttendanceStatus.ON_THE_WAY,
      unitId: unitIdStr,
      patientId: String(patient._id),
      changesHistory: [{ status: AttendanceStatus.ON_THE_WAY, changedAt: now }]
    })

    return res.status(201).json({
      message: 'Atendimento solicitado com sucesso!',
      data: attendance
    })
  } catch (error: unknown) {
    console.error(error)
    return res.status(500).json({
      message: 'Erro ao registrar solicitação de atendimento'
    })
  }
}
