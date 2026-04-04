import { Types } from 'mongoose'
import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { Attendance } from '../models/AttendanceModel.js'
import { getPeriodDateRange } from '../utils/getPeriodDateRange.js'

// ADMIN
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

export const getInAttendance = async ({ unitId }: { unitId: string }) => {
  try {
    const ACTIVE_STATUSES = [
      AttendanceStatus.WAITING_TRIAGE,
      AttendanceStatus.IN_TRIAGE,
      AttendanceStatus.TRIAGE_COMPLETED,
      AttendanceStatus.WAITING_ATTENDANCE,
      AttendanceStatus.IN_ATTENDANCE
    ]
    return await Attendance.countDocuments({
      unitId,
      status: { $in: ACTIVE_STATUSES }
    })
  } catch (err) {
    console.error(err)
  }
}

export const getAttended = async ({
  unitId,
  period,
  doctorId
}: {
  unitId: string
  period: string
  doctorId?: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

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
  maxOccupancy
}: {
  unitId: string
  maxOccupancy: number
}) => {
  try {
    if (!maxOccupancy) return 0

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
      }
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

// DOCTOR
export const getWaitingForDoctor = async ({ unitId }: { unitId: string }) => {
  try {
    return await Attendance.countDocuments({
      unitId,
      status: AttendanceStatus.WAITING_ATTENDANCE
    })
  } catch (err) {
    console.error(err)
  }
}

export const getDoctorAverageTime = async ({
  unitId,
  period,
  doctorId
}: {
  unitId: string
  period: string
  doctorId: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

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
      status: AttendanceStatus.WAITING_TRIAGE
    })
  } catch (err) {
    console.error(err)
  }
}

export const getTriaged = async ({
  unitId,
  period,
  nurseId
}: {
  unitId: string
  period: string
  nurseId: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

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
  nurseId
}: {
  unitId: string
  period: string
  nurseId: string
}) => {
  try {
    const { start, end } = getPeriodDateRange(period)

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
