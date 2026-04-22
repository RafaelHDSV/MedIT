import { Types } from 'mongoose'
import { AttendanceRisk, AttendanceStatus } from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import { toCanonicalDiseaseKey } from '../constants/diseaseLabelsPt.js'
import SymptomsDiseasesModel from '../models/SymptomsDiseasesModel.js'
import { getReportedSymptomsToDiseaseKeys } from '../utils/getReportedSymptomsToDiseaseKeys.js'
import { getPeriodDateRange } from '../utils/getPeriodDateRange.js'

const ACTIVE_STATUSES = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE
]

function scoreDiseaseFromProfile(
  profile: Record<string, number>,
  patientKeys: Set<string>
): number {
  let totalWeight = 0
  let matchedWeight = 0

  for (const [key, weightRaw] of Object.entries(profile)) {
    const weight = Number(weightRaw) || 0
    if (weight <= 0) continue
    totalWeight += weight
    if (patientKeys.has(key)) matchedWeight += weight
  }

  if (totalWeight <= 0) return 0
  return Math.round((100 * matchedWeight) / totalWeight)
}

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

export const getDoctorIAAssertiveness = async ({
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

    const [attendances, diseaseRows] = await Promise.all([
      Attendance.find({
        unitId: new Types.ObjectId(unitId),
        doctorId: new Types.ObjectId(doctorId),
        status: {
          $in: [
            AttendanceStatus.ATTENDANCE_COMPLETED,
            AttendanceStatus.COMPLETED
          ]
        },
        date: { $gte: start, $lte: end },
        $or: [
          { diagnosisKey: { $exists: true, $type: 'string' } },
          { diagnosis: { $exists: true, $type: 'string' } }
        ],
        symptoms: { $exists: true, $type: 'array', $ne: [] }
      })
        .select('diagnosisKey diagnosis symptoms')
        .lean<
          { diagnosisKey?: string; diagnosis?: string; symptoms?: string[] }[]
        >(),
      SymptomsDiseasesModel.find()
        .select('disease symptoms')
        .lean<{ disease: string; symptoms?: Record<string, number> }[]>()
    ])

    const diseaseProfiles = diseaseRows
      .map((row) => ({
        disease: row.disease,
        profile: row.symptoms ?? {}
      }))
      .filter((row) => row.disease && Object.keys(row.profile).length > 0)

    if (!diseaseProfiles.length) return 0

    let comparableCount = 0
    let correctCount = 0

    for (const attendance of attendances) {
      const diagnosisRaw =
        typeof attendance.diagnosisKey === 'string' &&
        attendance.diagnosisKey.trim().length > 0
          ? attendance.diagnosisKey.trim()
          : typeof attendance.diagnosis === 'string'
            ? attendance.diagnosis.trim()
            : ''
      if (!diagnosisRaw) continue

      const rawSymptoms = Array.isArray(attendance.symptoms)
        ? attendance.symptoms.filter((s): s is string => typeof s === 'string')
        : []
      const patientKeys = new Set(getReportedSymptomsToDiseaseKeys(rawSymptoms))
      if (patientKeys.size === 0) continue

      let bestDisease = ''
      let bestScore = -1
      for (const disease of diseaseProfiles) {
        const score = scoreDiseaseFromProfile(disease.profile, patientKeys)
        if (score > bestScore) {
          bestScore = score
          bestDisease = disease.disease
        }
      }

      if (!bestDisease) continue

      comparableCount++
      if (
        toCanonicalDiseaseKey(bestDisease) ===
        toCanonicalDiseaseKey(diagnosisRaw)
      ) {
        correctCount++
      }
    }

    if (comparableCount === 0) return 0
    return Math.round((correctCount / comparableCount) * 100)
  } catch (err) {
    console.error(err)
    return 0
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
