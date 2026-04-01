import { Types } from 'mongoose'
import { IBaseInterface } from './IBaseInterface.js'

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
  diagnosis?: string
  date: Date
  risk: AttendanceRisk
  status: AttendanceStatus
  patientId: Types.ObjectId
  unitId: Types.ObjectId
  nurseId?: Types.ObjectId
  doctorId?: Types.ObjectId
  medicationsIds?: Types.ObjectId[]
  changesHistory?: {
    status: AttendanceStatus
    changedAt: Date
  }[]
  vitalSigns?: IVitalSigns
  iaConditionId?: Types.ObjectId
}
