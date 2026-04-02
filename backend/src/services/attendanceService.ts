import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { Attendance } from '../models/AttendanceModel.js'
import { getPeriodDateRange } from '../utils/getPeriodDateRange.js'

export const getEntries = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

    const match = {
      unitId: unitId,
      status: {
        $in: [AttendanceStatus.ON_THE_WAY]
      },
      date: {
        $gte: start,
        $lte: end
      }
    }
    return await Attendance.countDocuments(match)
  } catch (err) {
    console.error(err)
  }
}

export const getAttended = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

    const match = {
      unitId: unitId,
      status: {
        $in: [AttendanceStatus.ATTENDANCE_COMPLETED, AttendanceStatus.COMPLETED]
      },
      date: {
        $gte: start,
        $lte: end
      }
    }
    return await Attendance.countDocuments(match)
  } catch (err) {
    console.error(err)
  }
}

export const getAttendanceOcuppation = async ({
  unitId,
  maxOccupancy,
  period
}: {
  unitId: string
  maxOccupancy: number
  period: string
}) => {
  try {
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
    const occupied = await Attendance.countDocuments(match)
    return Math.round((occupied / maxOccupancy) * 100)
  } catch (err) {
    console.error(err)
  }
}

export const getHighRisk = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  try {
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
  } catch (err) {
    console.error(err)
  }
}
