import { Types } from 'mongoose'
import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { getPeriodDateRange } from '../utils/getPeriodDateRange.js'

const ACTIVE_STATUSES = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE
]

// ADMIN
export const getEntries = async ({
  unitId,
  period,
  referenceDate
}: {
  unitId: string
  period: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

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
  period,
  referenceDate
}: {
  unitId: string
  period?: string
  referenceDate?: string
}) => {
  try {
    const match: Record<string, unknown> = {
      unitId,
      status: { $in: ACTIVE_STATUSES }
    }
    if (period) {
      const { start, end } = getPeriodDateRange(period, referenceDate)
      match.date = { $gte: start, $lte: end }
    }
    return await Attendance.countDocuments(match)
  } catch (err) {
    console.error(err)
  }
}

export const getAttended = async ({
  unitId,
  period,
  doctorId,
  referenceDate
}: {
  unitId: string
  period: string
  doctorId?: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    return await Attendance.countDocuments({
      unitId,
      ...(doctorId ? { doctorId: new Types.ObjectId(doctorId) } : {}),
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
  period,
  referenceDate
}: {
  unitId: string
  maxOccupancy: number
  period?: string
  referenceDate?: string
}) => {
  try {
    if (!maxOccupancy) return 0

    const match: Record<string, unknown> = {
      unitId,
      status: {
        $in: ACTIVE_STATUSES
      }
    }
    if (period) {
      const { start, end } = getPeriodDateRange(period, referenceDate)
      match.date = { $gte: start, $lte: end }
    }

    const occupied = await Attendance.countDocuments(match)

    return Math.round((occupied / maxOccupancy) * 100)
  } catch (err) {
    console.error(err)
  }
}

export const getAverageTime = async ({
  unitId,
  period,
  referenceDate
}: {
  unitId: string
  period: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    const result = await Attendance.aggregate([
      {
        $match: {
          unitId: new Types.ObjectId(unitId),
          status: AttendanceStatus.COMPLETED,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          completedAt: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$changesHistory',
                  as: 'c',
                  cond: { $eq: ['$$c.status', AttendanceStatus.COMPLETED] }
                }
              },
              -1
            ]
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

    return result.length ? Math.round(result[0].avg) : 0
  } catch (err) {
    console.error(err)
  }
}

export const getHighRisk = async ({
  unitId,
  period,
  referenceDate
}: {
  unitId: string
  period: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

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

// DOCTOR
export const getWaitingForDoctor = async ({ unitId }: { unitId: string }) => {
  try {
    return await Attendance.countDocuments({
      unitId,
      status: AttendanceStatus.WAITING_ATTENDANCE,
      $or: [{ doctorId: null }, { doctorId: { $exists: false } }]
    })
  } catch (err) {
    console.error(err)
  }
}

export const getDoctorAverageTime = async ({
  unitId,
  period,
  doctorId,
  referenceDate
}: {
  unitId: string
  period: string
  doctorId: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    const result = await Attendance.aggregate([
      {
        $match: {
          unitId: new Types.ObjectId(unitId),
          doctorId: new Types.ObjectId(doctorId),
          status: {
            $in: [
              AttendanceStatus.ATTENDANCE_COMPLETED,
              AttendanceStatus.COMPLETED
            ]
          },
          date: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          waitingAttendanceAt: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$changesHistory',
                  as: 'c',
                  cond: {
                    $eq: ['$$c.status', AttendanceStatus.WAITING_ATTENDANCE]
                  }
                }
              },
              -1
            ]
          },
          attendanceCompletedAt: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$changesHistory',
                  as: 'c',
                  cond: {
                    $eq: ['$$c.status', AttendanceStatus.ATTENDANCE_COMPLETED]
                  }
                }
              },
              -1
            ]
          }
        }
      },
      {
        $match: {
          waitingAttendanceAt: { $ne: null },
          attendanceCompletedAt: { $ne: null }
        }
      },
      {
        $addFields: {
          duration: {
            $divide: [
              {
                $subtract: [
                  '$attendanceCompletedAt.changedAt',
                  '$waitingAttendanceAt.changedAt'
                ]
              },
              60000
            ]
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

    return result.length ? Math.round(result[0].avg) : 0
  } catch (err) {
    console.error(err)
  }
}

// NURSE
export const getWaitingForTriage = async ({ unitId }: { unitId: string }) => {
  try {
    return await Attendance.countDocuments({
      unitId,
      status: AttendanceStatus.WAITING_TRIAGE,
      $or: [{ nurseId: null }, { nurseId: { $exists: false } }]
    })
  } catch (err) {
    console.error(err)
  }
}

export const getTriaged = async ({
  unitId,
  period,
  nurseId,
  referenceDate
}: {
  unitId: string
  period: string
  nurseId: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    return await Attendance.countDocuments({
      unitId,
      nurseId: new Types.ObjectId(nurseId),
      status: {
        $in: [
          AttendanceStatus.TRIAGE_COMPLETED,
          AttendanceStatus.WAITING_ATTENDANCE,
          AttendanceStatus.IN_ATTENDANCE,
          AttendanceStatus.ATTENDANCE_COMPLETED,
          AttendanceStatus.COMPLETED
        ]
      },
      date: { $gte: start, $lte: end }
    })
  } catch (err) {
    console.error(err)
  }
}

export const getTriageAverageTime = async ({
  unitId,
  period,
  nurseId,
  referenceDate
}: {
  unitId: string
  period: string
  nurseId: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    const result = await Attendance.aggregate([
      {
        $match: {
          unitId: new Types.ObjectId(unitId),
          nurseId: new Types.ObjectId(nurseId),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          waitingTriageAt: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$changesHistory',
                  as: 'c',
                  cond: {
                    $eq: ['$$c.status', AttendanceStatus.WAITING_TRIAGE]
                  }
                }
              },
              -1
            ]
          },
          triageCompletedAt: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$changesHistory',
                  as: 'c',
                  cond: {
                    $eq: ['$$c.status', AttendanceStatus.TRIAGE_COMPLETED]
                  }
                }
              },
              -1
            ]
          }
        }
      },
      {
        $match: {
          waitingTriageAt: { $ne: null },
          triageCompletedAt: { $ne: null }
        }
      },
      {
        $addFields: {
          duration: {
            $divide: [
              {
                $subtract: [
                  '$triageCompletedAt.changedAt',
                  '$waitingTriageAt.changedAt'
                ]
              },
              60000
            ]
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

    return result.length ? Math.round(result[0].avg) : 0
  } catch (err) {
    console.error(err)
  }
}

// getDashboardAttendanceByTime
export const getAttendanceByTime = async ({
  unitId,
  period,
  referenceDate
}: {
  unitId: string
  period: string
  referenceDate?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period, referenceDate)

    const groupBy =
      period === 'day'
        ? { $hour: '$date' }
        : period === 'week'
          ? { $dayOfWeek: '$date' }
          : period === 'month'
            ? { $dayOfMonth: '$date' }
            : period === 'year'
              ? { $month: '$date' }
              : { $hour: '$date' }

    const result = await Attendance.aggregate([
      {
        $match: {
          unitId: new Types.ObjectId(unitId),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          hour: '$_id',
          total: 1,
          _id: 0
        }
      }
    ])

    const range =
      period === 'day'
        ? 24
        : period === 'week'
          ? 7
          : period === 'month'
            ? end.getDate()
            : period === 'year'
              ? end.getMonth() + 1
              : 24

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ]

    const hours = Array.from({ length: range }).map((_, index) => {
      const value = period === 'day' ? index : index + 1
      const found = result.find((r) => r.hour === value)

      let label: string
      if (period === 'week') {
        label = weekDays[index]
      } else if (period === 'year') {
        label = monthNames[index]
      } else {
        label = String(value)
      }

      return {
        label,
        total: found ? found.total : 0
      }
    })

    return hours
  } catch (err) {
    console.error(err)
  }
}

export const getAttendanceQueue = async ({
  unitId,
  level,
  period,
  referenceDate
}: {
  unitId: string
  level?: UserLevels
  period?: string
  referenceDate?: string
}) => {
  const status = () => {
    switch (level) {
      case UserLevels.ADMIN:
        return ACTIVE_STATUSES
      case UserLevels.DOCTOR:
        return [AttendanceStatus.WAITING_ATTENDANCE]
      case UserLevels.NURSE:
        return [AttendanceStatus.WAITING_TRIAGE]
      case UserLevels.PATIENT:
        return []
      default:
        return []
    }
  }

  try {
    const poolMatch: Record<string, unknown> = {
      unitId: new Types.ObjectId(unitId),
      status: { $in: status() }
    }

    if (level === UserLevels.ADMIN && period) {
      const { start, end } = getPeriodDateRange(period, referenceDate)
      poolMatch.date = { $gte: start, $lte: end }
    }

    if (level === UserLevels.NURSE) {
      poolMatch.$or = [{ nurseId: null }, { nurseId: { $exists: false } }]
    }
    if (level === UserLevels.DOCTOR) {
      poolMatch.$or = [{ doctorId: null }, { doctorId: { $exists: false } }]
    }

    const data = await Attendance.aggregate([
      {
        $match: poolMatch
      },
      {
        $lookup: {
          from: 'users',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $unwind: {
          path: '$patient',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          riskPriority: {
            $switch: {
              branches: [
                { case: { $eq: ['$risk', AttendanceRisk.EMERGENCY] }, then: 1 },
                {
                  case: { $eq: ['$risk', AttendanceRisk.VERY_URGENT] },
                  then: 2
                },
                { case: { $eq: ['$risk', AttendanceRisk.URGENT] }, then: 3 },
                {
                  case: { $eq: ['$risk', AttendanceRisk.LESS_URGENT] },
                  then: 4
                },
                { case: { $eq: ['$risk', AttendanceRisk.NOT_URGENT] }, then: 5 }
              ],
              default: 6
            }
          }
        }
      },
      {
        $sort: { riskPriority: 1, date: 1 }
      },
      {
        $project: {
          _id: 1,
          number: 1,
          patientName: { $ifNull: ['$patient.name', 'Paciente'] },
          patientBirthDate: { $ifNull: ['$patient.birthDate', 'Paciente'] },
          complaint: 1,
          painLevel: 1,
          selfMedicated: 1,
          symptomStartDate: 1,
          symptoms: 1,
          generalObservation: 1,
          conditions: 1,
          allergies: 1,
          date: 1,
          status: 1,
          risk: 1
        }
      }
    ])

    return data
  } catch (err) {
    console.error(err)
    return []
  }
}
