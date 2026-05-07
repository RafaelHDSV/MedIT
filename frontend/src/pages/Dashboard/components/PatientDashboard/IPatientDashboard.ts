import { AttendanceStatus, type AttendanceRisk } from '@/interfaces/IAttendance'

export interface IPatientQueueItem {
  _id: string
  number?: number
  patientName: string
  status: AttendanceStatus
  risk: AttendanceRisk
  isCurrentUser?: boolean
}

export const NEXT_STATUS_MAP: Partial<
  Record<AttendanceStatus, AttendanceStatus>
> = {
  [AttendanceStatus.ON_THE_WAY]: AttendanceStatus.WAITING_TRIAGE,
  [AttendanceStatus.WAITING_TRIAGE]: AttendanceStatus.IN_TRIAGE,
  [AttendanceStatus.IN_TRIAGE]: AttendanceStatus.TRIAGE_COMPLETED,
  [AttendanceStatus.TRIAGE_COMPLETED]: AttendanceStatus.WAITING_ATTENDANCE,
  [AttendanceStatus.WAITING_ATTENDANCE]: AttendanceStatus.IN_ATTENDANCE,
  [AttendanceStatus.IN_ATTENDANCE]: AttendanceStatus.ATTENDANCE_COMPLETED
}
