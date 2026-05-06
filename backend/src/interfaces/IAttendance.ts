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

export const PatientDisposition = {
  HOSPITALIZED: 'hospitalized',
  HOME: 'home',
  OBSERVATION: 'observation',
  TRANSFER: 'transfer'
} as const
export type PatientDisposition =
  (typeof PatientDisposition)[keyof typeof PatientDisposition]
export const PatientDispositionLabels = {
  [PatientDisposition.HOSPITALIZED]: 'Ser internado',
  [PatientDisposition.HOME]: 'Ir para casa',
  [PatientDisposition.OBSERVATION]: 'Ficar em observação',
  [PatientDisposition.TRANSFER]: 'Ser transferido'
} as const

export interface IPrescribedMedication {
  name: string
  dosage?: string
  frequency?: string
  duration?: string
  observation?: string
}

export interface IAttendance extends IBaseInterface {
  complaint: string
  diagnosisKey?: string
  diagnosis?: string
  diagnosisText?: string
  date: Date
  triagedAt?: Date
  risk: AttendanceRisk
  status: AttendanceStatus
  unitId: Types.ObjectId
  patientId: Types.ObjectId
  nurseId?: Types.ObjectId
  doctorId?: Types.ObjectId
  medicationsIds?: Types.ObjectId[]
  changesHistory?: {
    status: AttendanceStatus
    changedAt: Date
  }[]
  vitalSigns?: IVitalSigns
  painLevel?: number
  selfMedicated?: boolean
  symptomStartDate?: Date
  symptoms?: string[]
  generalObservation?: string
  conditions?: string[]
  allergies?: string[]
  patientDisposition?: PatientDisposition
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
}
