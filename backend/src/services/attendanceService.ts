import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { Attendance } from '../models/AttendanceModel.js'

export const getAttendanceOcuppation = async (unitId: string) => {
  const unOccupiedStatus: AttendanceStatus[] = [
    AttendanceStatus.CANCELED,
    AttendanceStatus.ATTENDANCE_COMPLETED,
    AttendanceStatus.COMPLETED,
    AttendanceStatus.ON_THE_WAY
  ]
  const occupiedStatus = Object.values(AttendanceStatus).filter(
    (status) => !unOccupiedStatus.includes(status as AttendanceStatus)
  )
  const attendances = await Attendance.countDocuments({
    unitId: unitId,
    status: { $in: occupiedStatus }
  })

  return attendances
}

export const getHighRisk = async (unitId: string) => {
  const highRiskAttendances = await Attendance.countDocuments({
    unitId: unitId,
    risk: AttendanceRisk.EMERGENCY
  })
  return highRiskAttendances
}