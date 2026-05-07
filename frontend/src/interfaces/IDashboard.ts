import type { AttendanceRisk, AttendanceStatus } from './IAttendance'

export interface IAdminStatusCard {
  entries: number
  inAttendance: number
  attended: number
  occupancy: number
  averageTime: number
  highRisk: number
}

export interface IDoctorStatusCard {
  waitingPatients: number
  attended: number
  averageTime: number
  assertiveness: number
}

export interface INurseStatusCard {
  waitingPatients: number
  triagedPatients: number
  averageTime: number
}

export interface IDashboardStatusCards
  extends
    Partial<IAdminStatusCard>,
    Partial<IDoctorStatusCard>,
    Partial<INurseStatusCard> {}

export interface IDashboardQueueItem {
  _id: string
  number?: number
  dailyNumber?: number
  patientName: string
  patientBirthDate: Date
  date: Date
  complaint: string
  painLevel?: number
  selfMedicated?: boolean
  symptomStartDate?: Date
  symptoms?: string[]
  generalObservation?: string
  conditions?: string[]
  allergies?: string[]
  status: AttendanceStatus
  risk: AttendanceRisk
}

export interface IDashboardAttendanceByTime {
  label: number
  total: number
}
