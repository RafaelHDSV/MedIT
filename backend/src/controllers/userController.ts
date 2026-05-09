import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { DoctorSpecializations } from '../interfaces/IDoctor.js'
import { NurseShifts } from '../interfaces/INurse.js'
import { BloodType } from '../interfaces/IPatient.js'
import { UserGender, UserLevels } from '../interfaces/IUser.js'
import { Admin } from '../models/AdminModel.js'
import { Unit } from '../models/UnitModel.js'
import User from '../models/UserModel.js'
import capitalize from '../utils/capitalize.js'
import { sanitizeWorkLocationLabel } from '../utils/sanitizeWorkLocationLabel.js'

const sanitizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

function normalizeStringArray(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined
  const parsed = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return parsed.length ? parsed : undefined
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : undefined
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado', id })
  }

  res.json({ message: 'Usuário encontrado com sucesso!', data: user })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndDelete(id)
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  res.json({ message: 'Usuário deletado' })
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const {
      name,
      email,
      currentPassword,
      newPassword,
      cpf,
      birthDate,
      gender,
      cellphone,
      crm,
      specialization,
      coren,
      shift,
      weight,
      height,
      bloodType,
      conditions,
      allergies,
      workLocationLabel: workLocationLabelRaw
    } = req.body ?? {}

    const errors: Record<string, string> = {}

    const normalizedName = sanitizeString(name)
    const normalizedEmail = sanitizeString(email).toLowerCase()
    const normalizedCurrentPassword = sanitizeString(currentPassword)
    const normalizedNewPassword = sanitizeString(newPassword)
    const normalizedCpf = sanitizeString(cpf).replace(/\D/g, '')
    const normalizedCellphone = sanitizeString(cellphone).replace(/\D/g, '')

    if (name !== undefined) {
      if (!normalizedName || normalizedName.length < 3) {
        errors.name = 'Nome deve conter pelo menos 3 caracteres'
      }
    }

    if (email !== undefined) {
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        errors.email = 'Email inválido'
      }
    }

    if (newPassword !== undefined) {
      if (!normalizedCurrentPassword) {
        errors.currentPassword = 'Informe a senha atual para alterar a senha'
      }
      if (normalizedNewPassword.length < 6) {
        errors.newPassword = 'Nova senha deve ter no mínimo 6 caracteres'
      }
    }

    if (cpf !== undefined && !/^\d{11}$/.test(normalizedCpf)) {
      errors.cpf = 'CPF inválido'
    }

    if (
      cellphone !== undefined &&
      normalizedCellphone &&
      !/^\d{10,11}$/.test(normalizedCellphone)
    ) {
      errors.cellphone = 'Telefone inválido'
    }

    if (gender !== undefined && !Object.values(UserGender).includes(gender)) {
      errors.gender = 'Gênero inválido'
    }

    if (
      specialization !== undefined &&
      !Object.values(DoctorSpecializations).includes(specialization)
    ) {
      errors.specialization = 'Especialização inválida'
    }

    if (shift !== undefined && !Object.values(NurseShifts).includes(shift)) {
      errors.shift = 'Turno inválido'
    }

    if (
      bloodType !== undefined &&
      bloodType !== '' &&
      !Object.values(BloodType).includes(bloodType)
    ) {
      errors.bloodType = 'Tipo sanguíneo inválido'
    }

    if (
      user.level === UserLevels.DOCTOR &&
      workLocationLabelRaw !== undefined &&
      !sanitizeWorkLocationLabel(workLocationLabelRaw)
    ) {
      errors.workLocationLabel =
        'Sala ou consultório é obrigatório (o paciente vê ao iniciar o atendimento).'
    }

    if (
      user.level === UserLevels.NURSE &&
      workLocationLabelRaw !== undefined &&
      !sanitizeWorkLocationLabel(workLocationLabelRaw)
    ) {
      errors.workLocationLabel =
        'Sala ou local de triagem é obrigatório (o paciente vê ao iniciar a triagem).'
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: 'Campos inválidos', errors })
    }

    if (normalizedCurrentPassword && normalizedNewPassword) {
      const isMatch = await user.comparePassword(normalizedCurrentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }
      user.password = normalizedNewPassword
    }

    if (name !== undefined) user.name = normalizedName
    if (email !== undefined) user.email = normalizedEmail
    if (cpf !== undefined) user.cpf = normalizedCpf
    if (birthDate !== undefined) user.birthDate = birthDate
    if (gender !== undefined) user.gender = gender
    if (cellphone !== undefined) {
      user.cellphone = normalizedCellphone ? Number(normalizedCellphone) : undefined
    }

    if (user.level === UserLevels.DOCTOR) {
      if (crm !== undefined) (user as any).crm = sanitizeString(crm)
      if (specialization !== undefined) (user as any).specialization = specialization
      if (workLocationLabelRaw !== undefined) {
        ;(user as any).workLocationLabel =
          sanitizeWorkLocationLabel(workLocationLabelRaw)
      }
    }

    if (user.level === UserLevels.NURSE) {
      if (coren !== undefined) (user as any).coren = sanitizeString(coren)
      if (shift !== undefined) (user as any).shift = shift
      if (workLocationLabelRaw !== undefined) {
        ;(user as any).workLocationLabel =
          sanitizeWorkLocationLabel(workLocationLabelRaw)
      }
    }

    if (user.level === UserLevels.PATIENT) {
      const parsedWeight = parseOptionalNumber(weight)
      const parsedHeight = parseOptionalNumber(height)
      if (weight !== undefined) (user as any).weight = parsedWeight
      if (height !== undefined) (user as any).height = parsedHeight
      if (bloodType !== undefined) {
        ;(user as any).bloodType = bloodType || undefined
      }

      const normalizedConditions = normalizeStringArray(conditions)
      const normalizedAllergies = normalizeStringArray(allergies)
      if (conditions !== undefined) (user as any).conditions = normalizedConditions
      if (allergies !== undefined) (user as any).allergies = normalizedAllergies
    }

    await user.save()

    return res.status(200).json({
      message: 'Dados atualizados com sucesso',
      data: user
    })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: 'Campos inválidos',
        errors: { [field]: `${field} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao atualizar dados do usuário',
      error: error.message
    })
  }
}

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const { unitId, search } = req.query
    const filter: Record<string, unknown> = { level: UserLevels.ADMIN }

    if (typeof unitId === 'string' && unitId.trim()) {
      filter.unitId = new Types.ObjectId(unitId)
    }

    if (typeof search === 'string' && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' }
      filter.$or = [{ name: regex }, { email: regex }]
    }

    const admins = await Admin.find(filter as any)
      .sort({ createdAt: -1 })
      .select('-password -refreshToken')

    return res.json({
      message: 'Administradores encontrados com sucesso!',
      data: admins
    })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao buscar administradores', errors })
  }
}

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, cpf, email, password, unitId } = req.body ?? {}
    const errors: Record<string, string> = {}

    if (!name || name.trim().length < 3)
      errors.name = 'Nome deve ter pelo menos 3 caracteres'
    if (!cpf || !/^\d{11}$/.test(String(cpf).replace(/\D/g, '')))
      errors.cpf = 'CPF inválido'
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      errors.email = 'Email inválido'
    if (!password || password.length < 6)
      errors.password = 'Senha deve ter no mínimo 6 caracteres'
    if (!unitId) errors.unitId = 'Unidade é obrigatória'

    if (unitId && !Types.ObjectId.isValid(unitId))
      errors.unitId = 'ID da unidade inválido'

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: 'Campos inválidos', errors })
    }

    const unit = await Unit.findById(unitId)
    if (!unit) {
      return res
        .status(400)
        .json({ message: 'Campos inválidos', errors: { unitId: 'Unidade não encontrada' } })
    }

    const admin = new Admin({
      name: name.trim(),
      cpf: String(cpf).replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
      password,
      level: UserLevels.ADMIN,
      unitId: new Types.ObjectId(unitId)
    })

    await admin.save()

    return res
      .status(201)
      .json({ message: 'Administrador criado com sucesso', data: admin })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: 'Campos inválidos',
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res
      .status(500)
      .json({ message: 'Erro ao criar administrador', error: error.message })
  }
}

export const editAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const admin = await Admin.findById(id)
    if (!admin || admin.level !== UserLevels.ADMIN) {
      return res.status(404).json({ message: 'Administrador não encontrado' })
    }

    const { name, cpf, email, currentPassword, newPassword, unitId } =
      req.body ?? {}

    const errors: Record<string, string> = {}

    if (name !== undefined && name.trim().length < 3)
      errors.name = 'Nome deve ter pelo menos 3 caracteres'
    if (cpf !== undefined && !/^\d{11}$/.test(String(cpf).replace(/\D/g, '')))
      errors.cpf = 'CPF inválido'
    if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email))
      errors.email = 'Email inválido'
    if (newPassword !== undefined && newPassword.length < 6)
      errors.newPassword = 'Nova senha deve ter no mínimo 6 caracteres'
    if (unitId !== undefined && !Types.ObjectId.isValid(unitId))
      errors.unitId = 'ID da unidade inválido'

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: 'Campos inválidos', errors })
    }

    if (currentPassword && newPassword) {
      const isMatch = await admin.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }
      admin.password = newPassword
    }

    if (name !== undefined) admin.name = name.trim()
    if (cpf !== undefined) admin.cpf = String(cpf).replace(/\D/g, '')
    if (email !== undefined) admin.email = email.trim().toLowerCase()
    if (unitId !== undefined) {
      const unit = await Unit.findById(unitId)
      if (!unit) {
        return res
          .status(400)
          .json({ message: 'Campos inválidos', errors: { unitId: 'Unidade não encontrada' } })
      }
      admin.unitId = new Types.ObjectId(unitId) as any
    }

    await admin.save()

    return res
      .status(200)
      .json({ message: 'Administrador atualizado com sucesso', data: admin })
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: 'Campos inválidos',
        errors: { [field]: `${capitalize(field)} já está em uso` }
      })
    }

    return res.status(500).json({
      message: 'Erro ao editar administrador',
      error: error.message
    })
  }
}
