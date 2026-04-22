import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { AttendanceStatus } from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import { toDiseaseLabelPt } from '../constants/diseaseLabelsPt.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Patient } from '../models/PatientModel.js'
import SymptomsDiseasesModel from '../models/SymptomsDiseasesModel.js'
import User from '../models/UserModel.js'
import {
  computeSuggestionDetailForDisease,
  suggestDiseasesFromReportedSymptoms
} from '../services/symptomsDiseaseSuggestionService.js'
import { getReportedSymptomsToDiseaseKeys } from '../utils/getReportedSymptomsToDiseaseKeys.js'

const historyEntry = (status: AttendanceStatus) => ({
  status,
  changedAt: new Date()
})

const paramId = (value: string | string[] | undefined) =>
  String(Array.isArray(value) ? value[0] : value)

export const claimTriage = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.NURSE) {
      return res
        .status(403)
        .json({ message: 'Apenas enfermeiros podem assumir a triagem.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const filter = {
      _id: new Types.ObjectId(attendanceId),
      unitId: user.unitId,
      status: AttendanceStatus.WAITING_TRIAGE,
      $or: [{ nurseId: null }, { nurseId: { $exists: false } }]
    }

    const updated = await Attendance.findOneAndUpdate(
      filter as never,
      {
        $set: {
          nurseId: user._id,
          status: AttendanceStatus.IN_TRIAGE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.IN_TRIAGE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Este atendimento não está mais disponível na fila (já assumido ou status alterado).'
      })
    }

    return res.json({
      message: 'Triagem iniciada com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao assumir a triagem.' })
  }
}

export const completeTriage = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.NURSE) {
      return res.status(403).json({
        message: 'Apenas enfermeiros podem concluir a triagem.'
      })
    }

    const triageFilter = {
      _id: new Types.ObjectId(attendanceId),
      nurseId: user._id,
      status: AttendanceStatus.IN_TRIAGE
    }

    const updated = await Attendance.findOneAndUpdate(
      triageFilter as never,
      {
        $set: {
          status: AttendanceStatus.WAITING_ATTENDANCE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.WAITING_ATTENDANCE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Não foi possível concluir a triagem. Verifique se você é a enfermeira responsável e se o atendimento está em triagem.'
      })
    }

    return res.json({
      message: 'Triagem concluída. O paciente segue para a fila médica.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao concluir a triagem.' })
  }
}

export const claimDoctorConsult = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.DOCTOR) {
      return res
        .status(403)
        .json({ message: 'Apenas médicos podem assumir o atendimento.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const doctorFilter = {
      _id: new Types.ObjectId(attendanceId),
      unitId: user.unitId,
      status: AttendanceStatus.WAITING_ATTENDANCE,
      $or: [{ doctorId: null }, { doctorId: { $exists: false } }]
    }

    const updated = await Attendance.findOneAndUpdate(
      doctorFilter as never,
      {
        $set: {
          doctorId: user._id,
          status: AttendanceStatus.IN_ATTENDANCE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.IN_ATTENDANCE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Este atendimento não está mais disponível na fila (já assumido ou status alterado).'
      })
    }

    return res.json({
      message: 'Atendimento iniciado com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao assumir o atendimento.' })
  }
}

export const completeAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.DOCTOR) {
      return res.status(403).json({
        message: 'Apenas médicos podem finalizar o atendimento.'
      })
    }

    const diagnosisKeyRaw = req.body?.diagnosisKey
    const diagnosisTextRaw = req.body?.diagnosisText
    const diagnosisKey =
      typeof diagnosisKeyRaw === 'string' ? diagnosisKeyRaw.trim() : ''
    const diagnosisText =
      typeof diagnosisTextRaw === 'string' ? diagnosisTextRaw.trim() : ''

    if (!diagnosisKey) {
      return res.status(400).json({
        message: 'Informe um diagnóstico válido para finalizar o atendimento.'
      })
    }

    const disease = await SymptomsDiseasesModel.findOne({
      disease: diagnosisKey
    })
      .select('disease')
      .lean()

    if (!disease) {
      return res.status(400).json({
        message: 'Diagnóstico não encontrado na base de condições.'
      })
    }

    const updated = await Attendance.findOneAndUpdate(
      {
        _id: new Types.ObjectId(attendanceId),
        doctorId: user._id,
        status: AttendanceStatus.IN_ATTENDANCE
      } as never,
      {
        $set: {
          status: AttendanceStatus.ATTENDANCE_COMPLETED,
          diagnosisKey: disease.disease,
          diagnosis: toDiseaseLabelPt(disease.disease),
          ...(diagnosisText ? { diagnosisText } : {})
        },
        ...(diagnosisText ? {} : { $unset: { diagnosisText: '' } }),
        $push: {
          changesHistory: historyEntry(AttendanceStatus.ATTENDANCE_COMPLETED)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Não foi possível finalizar o atendimento. Verifique se você é o médico responsável e se o atendimento está em andamento.'
      })
    }

    return res.json({
      message: 'Atendimento finalizado com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao finalizar atendimento.' })
  }
}

const staffLevelsSuggest = new Set<UserLevels>([
  UserLevels.DOCTOR,
  UserLevels.NURSE
])

export const getStaffAttendanceDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || !staffLevelsSuggest.has(user.level as UserLevels)) {
      return res.status(403).json({
        message: 'Sem permissão para consultar este atendimento.'
      })
    }

    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const unitId = new Types.ObjectId(String(user.unitId))
    const attendance = await Attendance.findOne({
      _id: new Types.ObjectId(attendanceId),
      unitId
    } as any)
      .populate({
        path: 'patientId',
        model: Patient,
        select: 'name birthDate gender allergies conditions'
      })
      .lean()
    if (!attendance) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' })
    }

    const att = { ...(attendance as unknown as Record<string, unknown>) }
    const patient = att.patientId as {
      name?: string
      birthDate?: Date
      gender?: string
      allergies?: string[]
      conditions?: string[]
    } | null
    delete att.patientId

    return res.json({
      message: 'Atendimento encontrado.',
      data: {
        ...att,
        patient: patient ?? undefined
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar o atendimento.' })
  }
}

export const getSuggestedDiseases = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || !staffLevelsSuggest.has(user.level as UserLevels)) {
      return res.status(403).json({
        message: 'Sem permissão para consultar sugestões deste atendimento.'
      })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const unitOid = new Types.ObjectId(String(user.unitId))
    const attendance = await Attendance.findOne({
      _id: new Types.ObjectId(attendanceId),
      unitId: unitOid
    } as never)
      .select('symptoms unitId')
      .lean()

    if (!attendance) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' })
    }

    const reported = Array.isArray(attendance.symptoms)
      ? attendance.symptoms.filter((s): s is string => typeof s === 'string')
      : []

    const normalizedKeys = getReportedSymptomsToDiseaseKeys(reported)
    const suggestions = await suggestDiseasesFromReportedSymptoms(reported)

    return res.json({
      message:
        'Sugestões calculadas (apoio à decisão; não constitui diagnóstico).',
      data: {
        suggestions,
        normalizedSymptomKeys: normalizedKeys,
        reportedSymptoms: reported
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao calcular sugestões.' })
  }
}

export const getSuggestionDetail = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    const diseaseRaw = req.query.disease
    const diseaseName = typeof diseaseRaw === 'string' ? diseaseRaw.trim() : ''

    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }
    if (!diseaseName) {
      return res
        .status(400)
        .json({ message: 'Informe o parâmetro de consulta disease.' })
    }

    const user = await User.findById(req.userId)
    if (!user || !staffLevelsSuggest.has(user.level as UserLevels)) {
      return res.status(403).json({
        message: 'Sem permissão para consultar o detalhe desta sugestão.'
      })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const unitOid = new Types.ObjectId(String(user.unitId))
    const attendance = await Attendance.findOne({
      _id: new Types.ObjectId(attendanceId),
      unitId: unitOid
    } as never)
      .select('symptoms')
      .lean()

    if (!attendance) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' })
    }

    const reported = Array.isArray(attendance.symptoms)
      ? attendance.symptoms.filter((s): s is string => typeof s === 'string')
      : []

    const diseaseRow = await SymptomsDiseasesModel.findOne({
      disease: diseaseName
    }).lean()

    if (!diseaseRow) {
      return res.status(404).json({
        message: 'Doença não encontrada na base sintoma–doença.'
      })
    }

    const data = computeSuggestionDetailForDisease(diseaseRow, reported)

    return res.json({
      message: 'Detalhe da sugestão (apoio à decisão).',
      data
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ message: 'Erro ao montar detalhe da sugestão.' })
  }
}
