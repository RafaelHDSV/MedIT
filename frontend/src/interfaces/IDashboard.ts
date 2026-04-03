import type { AttendanceRisk } from './IAttendance'

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
  patientName: string
  status: string
  risk: AttendanceRisk
}

export interface IDashboardAttendanceByTime {
  hour: number
  total: number
}
