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
      changesHistory: {
        $elemMatch: {
          status: { $in: [AttendanceStatus.ON_THE_WAY] },
          changedAt: { $gte: start, $lte: end }
        }
      }
    }
    console.log(match)
    return await Attendance.countDocuments(match)
  } catch (err) {
    console.error(err)
  }
}

export const getInAttendance = async ({
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
        $in: [
          AttendanceStatus.WAITING_TRIAGE,
          AttendanceStatus.IN_TRIAGE,
          AttendanceStatus.TRIAGE_COMPLETED,
          AttendanceStatus.WAITING_ATTENDANCE,
          AttendanceStatus.IN_ATTENDANCE
        ]
      },
      date: {
        $gte: start,
        $lte: end
      }
    }
    console.log(match)
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
        $in: [
          AttendanceStatus.ATTENDANCE_COMPLETED,
          AttendanceStatus.COMPLETED,
          AttendanceStatus.CANCELED
        ]
      },
      date: {
        $gte: start,
        $lte: end
      }
    }
    console.log(match)
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

export const getAverageTime = async ({
  unitId,
  period
}: {
  unitId: string
  period: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

    const match = {
      unitId,
      status: AttendanceStatus.COMPLETED,
      date: {
        $gte: start,
        $lte: end
      }
    }

    const attendances = await Attendance.find(match)

    const validAttendances = attendances.filter((attendance) => {
      return attendance.changesHistory?.some(
        (c) => c.status === AttendanceStatus.COMPLETED
      )
    })

    const totalTime = validAttendances.reduce((acc, attendance) => {
      const completed = attendance.changesHistory?.find(
        (c) => c.status === AttendanceStatus.COMPLETED
      )
      if (!completed) return acc

      const startTime = attendance.date.getTime()
      const endTime = completed.changedAt.getTime()
      const time = (endTime - startTime) / 60000

      return acc + time
    }, 0)

    return validAttendances.length > 0
      ? Math.round(totalTime / validAttendances.length)
      : 0
  } catch (err) {
    console.error(err)
    return 0
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
