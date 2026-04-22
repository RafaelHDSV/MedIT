import type { ObjectId } from 'mongoose'
import type { IBaseInterface } from './IBaseInterface'

export const AttendanceRisk = {
  EMERGENCY: 'emergency',
  VERY_URGENT: 'veryUrgent',
  URGENT: 'urgent',
  LESS_URGENT: 'lessUrgent',
  NOT_URGENT: 'notUrgent'
} as const
export type AttendanceRisk =
  (typeof AttendanceRisk)[keyof typeof AttendanceRisk]
export const AttendanceRiskLabels = {
  [AttendanceRisk.EMERGENCY]: 'Emergência',
  [AttendanceRisk.VERY_URGENT]: 'Muito urgente',
  [AttendanceRisk.URGENT]: 'Urgente',
  [AttendanceRisk.LESS_URGENT]: 'Pouco urgente',
  [AttendanceRisk.NOT_URGENT]: 'Não urgente'
} as const

export const AttendanceStatus = {
  ON_THE_WAY: 'onTheWay',
  WAITING_TRIAGE: 'waitingTriage',
  IN_TRIAGE: 'inTriage',
  TRIAGE_COMPLETED: 'triageCompleted',
  WAITING_ATTENDANCE: 'waitingAttendance',
  IN_ATTENDANCE: 'inAttendance',
  ATTENDANCE_COMPLETED: 'attendanceCompleted',
  CANCELED: 'canceled',
  COMPLETED: 'completed'
} as const
export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus]
export const AttendanceStatusLabels = {
  [AttendanceStatus.ON_THE_WAY]: 'A caminho',
  [AttendanceStatus.WAITING_TRIAGE]: 'Aguardando triagem',
  [AttendanceStatus.IN_TRIAGE]: 'Em triagem',
  [AttendanceStatus.TRIAGE_COMPLETED]: 'Triagem concluída',
  [AttendanceStatus.WAITING_ATTENDANCE]: 'Aguardando atendimento',
  [AttendanceStatus.IN_ATTENDANCE]: 'Em atendimento',
  [AttendanceStatus.ATTENDANCE_COMPLETED]: 'Atendimento concluído',
  [AttendanceStatus.CANCELED]: 'Cancelado',
  [AttendanceStatus.COMPLETED]: 'Concluído'
} as const

export interface IVitalSigns {
  bloodPressure?: string
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
}

export interface IAttendance extends IBaseInterface {
  complaint: string
  diagnosisKey?: string
  diagnosis?: string
  diagnosisText?: string
  date: Date
  risk: AttendanceRisk
  status: AttendanceStatus
  unitId: ObjectId
  patientId: ObjectId
  nurseId?: ObjectId
  doctorId?: ObjectId
  medicationsIds?: ObjectId[]
  vitalSigns?: IVitalSigns
  iaConditionId?: ObjectId
  painLevel?: number
  selfMedicated?: boolean
  symptomStartDate?: Date
  symptoms?: string[]
  generalObservation?: string
  conditions?: string[]
  allergies?: string[]
  iaTopSuggestion?: string
  isIaTopSuggestionMatchDiagnosis?: boolean
}

interface IAttendancePatient {
  name?: string
  birthDate?: string | Date
  gender?: string
  allergies?: string[]
  conditions?: string[]
}

export interface IAttendanceDetails {
  _id: ObjectId | string
  complaint: string
  diagnosisKey?: string
  diagnosis?: string
  diagnosisText?: string
  date: string | Date
  risk: AttendanceRisk
  status: AttendanceStatus
  unitId: ObjectId | string
  nurseId?: ObjectId | string
  doctorId?: ObjectId | string
  vitalSigns?: IVitalSigns
  painLevel?: number
  selfMedicated?: boolean
  symptomStartDate?: string | Date
  symptoms?: string[]
  generalObservation?: string
  conditions?: string[]
  allergies?: string[]
  patient?: IAttendancePatient
}
