import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { toDiseaseLabelPt } from '../constants/diseaseLabelsPt.js'
import {
  AttendanceRisk,
  AttendanceStatus,
  IPrescribedMedication,
  PatientDisposition,
  type IVitalSigns
} from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { Patient } from '../models/PatientModel.js'
import SymptomsDiseasesModel from '../models/SymptomsDiseasesModel.js'
import User from '../models/UserModel.js'
import {
  computeSuggestionDetailForDisease,
  suggestDiseasesFromReportedSymptoms
} from '../services/symptomsDiseaseSuggestionService.js'
import { getReportedSymptomsToDiseaseKeys } from '../utils/getReportedSymptomsToDiseaseKeys.js'
import { parseFiniteNumber, parsePositiveInt } from '../utils/parseNumbers.js'

const VALID_DISPOSITIONS = new Set<string>(Object.values(PatientDisposition))

const sanitizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

function sanitizePrescribedMedications(
  raw: unknown
): IPrescribedMedication[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const cleaned: IPrescribedMedication[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const name = sanitizeString(record.name)
    if (!name) continue
    const med: IPrescribedMedication = { name }
    const dosage = sanitizeString(record.dosage)
    const frequency = sanitizeString(record.frequency)
    const duration = sanitizeString(record.duration)
    const observation = sanitizeString(record.observation)
    if (dosage) med.dosage = dosage
    if (frequency) med.frequency = frequency
    if (duration) med.duration = duration
    if (observation) med.observation = observation
    cleaned.push(med)
  }
  return cleaned
}

function sanitizePrescribedExams(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const seen = new Set<string>()
  const cleaned: string[] = []
  for (const entry of raw) {
    const value = sanitizeString(entry)
    if (!value) continue
    const key = value.toLocaleLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    cleaned.push(value)
  }
  return cleaned
}

const historyEntry = (status: AttendanceStatus) => ({
  status,
  changedAt: new Date()
})

function parseVitalSignsFromBody(raw: unknown): IVitalSigns | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined

  const rawObject = raw as Record<string, unknown>
  const { temperature, heartRate, oxygenSaturation, bloodPressure } = rawObject
  const vitalSigns: IVitalSigns = {}

  const t = parseFiniteNumber(temperature)
  if (t !== undefined && t >= 20 && t <= 65) vitalSigns.temperature = t

  const hr = parsePositiveInt(heartRate)
  if (hr !== undefined && hr > 0 && hr <= 400) vitalSigns.heartRate = hr

  const o2 = parsePositiveInt(oxygenSaturation)
  if (o2 !== undefined && o2 <= 100) vitalSigns.oxygenSaturation = o2

  if (typeof bloodPressure === 'string') {
    const bp = bloodPressure.trim().slice(0, 32)
    if (bp) vitalSigns.bloodPressure = bp
  }

  return Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined
}

function sanitizeTriageCompletionFields(body: unknown): {
  set: Record<string, unknown>
  unset: Record<string, ''>
  error?: string
} {
  const VALID_RISKS = new Set<string>(Object.values(AttendanceRisk))

  const set: Record<string, unknown> = {}
  const unset: Record<string, ''> = {}
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { set, unset }
  }
  const b = body as Record<string, unknown>

  if (Object.prototype.hasOwnProperty.call(b, 'risk')) {
    const riskRaw = typeof b.risk === 'string' ? b.risk.trim() : ''
    if (!riskRaw || !VALID_RISKS.has(riskRaw)) {
      return { set, unset, error: 'Classificação de risco inválida.' }
    }
    set.risk = riskRaw as AttendanceRisk
  }

  if (Object.prototype.hasOwnProperty.call(b, 'symptoms')) {
    if (!Array.isArray(b.symptoms)) {
      return { set, unset, error: 'Lista de sintomas inválida.' }
    }
    set.symptoms = b.symptoms.map((s) => String(s).trim()).filter(Boolean)
  }

  if (Object.prototype.hasOwnProperty.call(b, 'generalObservation')) {
    if (typeof b.generalObservation !== 'string') {
      return { set, unset, error: 'Observação geral inválida.' }
    }
    const go = b.generalObservation.trim()
    if (go) set.generalObservation = go
    else unset.generalObservation = ''
  }

  if (Object.prototype.hasOwnProperty.call(b, 'painLevel')) {
    if (b.painLevel === null) {
      unset.painLevel = ''
    } else {
      const p = parseFiniteNumber(b.painLevel)
      if (p === undefined || p < 0 || p > 10) {
        return {
          set,
          unset,
          error: 'Escala de dor deve ser um número entre 0 e 10.'
        }
      }
      set.painLevel = Math.round(p * 10) / 10
    }
  }

  if (Object.prototype.hasOwnProperty.call(b, 'vitalSigns')) {
    const parsed = parseVitalSignsFromBody(b.vitalSigns)
    if (parsed && Object.keys(parsed).length > 0) set.vitalSigns = parsed
    else unset.vitalSigns = ''
  }

  return { set, unset }
}

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

    const triageFields = sanitizeTriageCompletionFields(req.body)
    if (triageFields.error) {
      return res.status(400).json({ message: triageFields.error })
    }

    const setPayload: Record<string, unknown> = {
      status: AttendanceStatus.WAITING_ATTENDANCE,
      ...triageFields.set
    }
    const unsetPayload = triageFields.unset

    const updated = await Attendance.findOneAndUpdate(
      triageFilter as never,
      {
        $set: setPayload,
        ...(Object.keys(unsetPayload).length ? { $unset: unsetPayload } : {}),
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

export const releaseTriage = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.NURSE) {
      return res
        .status(403)
        .json({ message: 'Apenas enfermeiros podem liberar a triagem.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const updated = await Attendance.findOneAndUpdate(
      {
        _id: new Types.ObjectId(attendanceId),
        unitId: user.unitId,
        nurseId: user._id,
        status: AttendanceStatus.IN_TRIAGE
      } as never,
      {
        $set: { status: AttendanceStatus.WAITING_TRIAGE },
        $unset: { nurseId: '' },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.WAITING_TRIAGE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Não foi possível liberar a triagem. Verifique se você é a enfermeira responsável e se o atendimento está em triagem.'
      })
    }

    return res.json({
      message: 'Triagem devolvida para a fila com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao liberar a triagem.' })
  }
}

export const releaseDoctorConsult = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.DOCTOR) {
      return res
        .status(403)
        .json({ message: 'Apenas médicos podem liberar o atendimento.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const updated = await Attendance.findOneAndUpdate(
      {
        _id: new Types.ObjectId(attendanceId),
        unitId: user.unitId,
        doctorId: user._id,
        status: AttendanceStatus.IN_ATTENDANCE
      } as never,
      {
        $set: { status: AttendanceStatus.WAITING_ATTENDANCE },
        $unset: { doctorId: '' },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.WAITING_ATTENDANCE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Não foi possível liberar o atendimento. Verifique se você é o médico responsável e se o atendimento está em andamento.'
      })
    }

    return res.json({
      message: 'Atendimento devolvido para a fila com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao liberar o atendimento.' })
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

    const diagnosisKey = sanitizeString(req.body?.diagnosisKey)
    const diagnosisText = sanitizeString(req.body?.diagnosisText)
    const patientDispositionRaw = sanitizeString(req.body?.patientDisposition)
    const prescribedMedications = sanitizePrescribedMedications(
      req.body?.prescribedMedications
    )
    const prescribedExams = sanitizePrescribedExams(req.body?.prescribedExams)

    if (!diagnosisKey) {
      return res.status(400).json({
        message: 'Informe um diagnóstico válido para finalizar o atendimento.'
      })
    }

    if (
      patientDispositionRaw &&
      !VALID_DISPOSITIONS.has(patientDispositionRaw)
    ) {
      return res.status(400).json({
        message: 'Destino do paciente inválido.'
      })
    }
    const patientDisposition = patientDispositionRaw
      ? (patientDispositionRaw as PatientDisposition)
      : undefined

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

    const setPayload: Record<string, unknown> = {
      status: AttendanceStatus.ATTENDANCE_COMPLETED,
      diagnosisKey: disease.disease,
      diagnosis: toDiseaseLabelPt(disease.disease)
    }
    const unsetPayload: Record<string, ''> = {}

    if (diagnosisText) setPayload.diagnosisText = diagnosisText
    else unsetPayload.diagnosisText = ''

    if (patientDisposition) setPayload.patientDisposition = patientDisposition
    else unsetPayload.patientDisposition = ''

    if (prescribedMedications && prescribedMedications.length)
      setPayload.prescribedMedications = prescribedMedications
    else unsetPayload.prescribedMedications = ''

    if (prescribedExams && prescribedExams.length)
      setPayload.prescribedExams = prescribedExams
    else unsetPayload.prescribedExams = ''

    const updated = await Attendance.findOneAndUpdate(
      {
        _id: new Types.ObjectId(attendanceId),
        doctorId: user._id,
        status: AttendanceStatus.IN_ATTENDANCE
      } as never,
      {
        $set: setPayload,
        ...(Object.keys(unsetPayload).length ? { $unset: unsetPayload } : {}),
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
