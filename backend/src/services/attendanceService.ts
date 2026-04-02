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

    return await Attendance.countDocuments({
      unitId,
      date: { $gte: start, $lte: end }
    })
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

    const ACTIVE_STATUSES = [
      AttendanceStatus.WAITING_TRIAGE,
      AttendanceStatus.IN_TRIAGE,
      AttendanceStatus.TRIAGE_COMPLETED,
      AttendanceStatus.WAITING_ATTENDANCE,
      AttendanceStatus.IN_ATTENDANCE
    ]
    return await Attendance.countDocuments({
      unitId,
      status: { $in: ACTIVE_STATUSES },
      date: { $gte: start, $lte: end }
    })
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

    return await Attendance.countDocuments({
      unitId,
      status: {
        $in: [AttendanceStatus.ATTENDANCE_COMPLETED, AttendanceStatus.COMPLETED]
      },
      date: { $gte: start, $lte: end }
    })
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
    if (!maxOccupancy) return 0

    const { start, end } = getPeriodDateRange(period)

    const occupied = await Attendance.countDocuments({
      unitId,
      status: {
        $in: [
          AttendanceStatus.WAITING_TRIAGE,
          AttendanceStatus.IN_TRIAGE,
          AttendanceStatus.TRIAGE_COMPLETED,
          AttendanceStatus.WAITING_ATTENDANCE,
          AttendanceStatus.IN_ATTENDANCE
        ]
      },
      date: { $gte: start, $lte: end }
    })

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

    const result = await Attendance.aggregate([
      {
        $match: {
          unitId,
          status: AttendanceStatus.COMPLETED,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          completedAt: {
            $first: {
              $filter: {
                input: '$changesHistory',
                as: 'c',
                cond: { $eq: ['$$c.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $match: {
          completedAt: { $ne: null }
        }
      },
      {
        $addFields: {
          duration: {
            $divide: [{ $subtract: ['$completedAt.changedAt', '$date'] }, 60000]
          }
        }
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$duration' }
        }
      }
    ])

    return result[0]?.avg ? Math.round(result[0].avg) : 0
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
      risk: {
        $in: [AttendanceRisk.EMERGENCY, AttendanceRisk.VERY_URGENT]
      },
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
