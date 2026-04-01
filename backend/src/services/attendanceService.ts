import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { Attendance } from '../models/AttendanceModel.js'
import { getPeriodDateRange } from '../utils/getPeriodDateRange.js'

export const getAttendanceOcuppation = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  const unOccupiedStatus: AttendanceStatus[] = [
    AttendanceStatus.CANCELED,
    AttendanceStatus.ATTENDANCE_COMPLETED,
    AttendanceStatus.COMPLETED,
    AttendanceStatus.ON_THE_WAY
  ]
  const occupiedStatus = Object.values(AttendanceStatus).filter(
    (status) => !unOccupiedStatus.includes(status as AttendanceStatus)
  )

  const { start, end } = getPeriodDateRange(period)

  const match = {
    unitId: unitId,
    status: { $in: occupiedStatus },
    date: {
      $gte: start,
      $lte: end
    }
  }
  const attendances = await Attendance.countDocuments(match)

  return attendances
}

export const getHighRisk = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  const { start, end } = getPeriodDateRange(period)

  const highRiskAttendances = await Attendance.countDocuments({
    unitId: unitId,
    risk: AttendanceRisk.EMERGENCY,
    date: {
      $gte: start,
      $lte: end
    }
  })
  return highRiskAttendances
}
