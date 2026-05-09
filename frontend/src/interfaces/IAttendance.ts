import type { ObjectId } from 'mongoose'
import type { IBaseInterface } from './IBaseInterface'
import type { UserGender, UserLevels } from './IUser'

export const AttendanceOpeningSource = {
  PATIENT_PRE_REGISTRATION: 'patientPreRegistration',
  NURSE_WALK_IN: 'nurseWalkIn'
} as const
export type AttendanceOpeningSource =
  (typeof AttendanceOpeningSource)[keyof typeof AttendanceOpeningSource]

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
  ATTENDANCE_COMPLETED: 'attendanceCompleted'
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
  [AttendanceStatus.ATTENDANCE_COMPLETED]: 'Atendimento concluído'
} as const

export const PatientFlowNoticeKind = {
  TRIAGE_START: 'triage_start',
  CONSULT_START: 'consult_start'
} as const
export type PatientFlowNoticeKind =
  (typeof PatientFlowNoticeKind)[keyof typeof PatientFlowNoticeKind]

export interface IPatientFlowNotice {
  kind: PatientFlowNoticeKind
  locationLabel: string
  createdAt: string | Date
  actorUserId: string | ObjectId
  actorLevel: UserLevels
}

export interface IVitalSigns {
  bloodPressure?: string
  heartRate?: number
  temperature?: number
  oxygenSaturation?: number
}

export type VitalFieldDraft = {
  temperature: string
  bloodPressure: string
  heartRate: string
  oxygenSaturation: string
  painLevel: string
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
  unitId: ObjectId
  patientId: ObjectId
  nurseId?: ObjectId
  doctorId?: ObjectId
  doctorName?: string
  unitName?: string
  medicationsIds?: ObjectId[]
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
  iaTopSuggestion?: string
  isIaTopSuggestionMatchDiagnosis?: boolean
  openingSource?: AttendanceOpeningSource
  openedByUserId?: ObjectId | string
  openedByLevel?: UserLevels
  patientFlowNotices?: IPatientFlowNotice[]
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
  patientDisposition?: PatientDisposition
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
  changesHistory?: {
    status: AttendanceStatus | string
    changedAt: string | Date
  }[]
  updatedAt?: string | Date
  patient?: IAttendancePatient
}

export interface IWalkInTriagePayload {
  patientName: string
  patientCpf: string
  patientEmail: string
  patientPassword?: string
  mainComplaint: string
  painLevel: number
  selfMedicated: boolean
  symptomStartDate: string
  symptoms?: string[]
  conditions?: string
  allergies?: string
  generalObservation?: string
  birthDate?: string
  gender?: UserGender
}

export interface ICompleteTriagePayload {
  attendanceId: string
  risk?: AttendanceRisk
  symptoms?: string[]
  generalObservation?: string
  vitalSigns?: IVitalSigns
  painLevel?: number | null
}
