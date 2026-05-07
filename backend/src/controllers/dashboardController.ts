import { Request, Response } from 'express'
import {
  IAdminStatusCard,
  IDashboardStatusCards,
  IDoctorStatusCard,
  IMeditStatusCard,
  INurseStatusCard
} from '../interfaces/IDashboard.js'
import { UserLevels } from '../interfaces/IUser.js'
import {
  getAttendanceByTime,
  getAttendanceOcuppation,
  getAttendanceQueue,
  getAttended,
  getAverageTime,
  getDoctorAverageTime,
  getDoctorIAAssertiveness,
  getEntries,
  getHighRisk,
  getInAttendance,
  getTriageAverageTime,
  getTriaged,
  getWaitingForDoctor,
  getWaitingForTriage
} from '../services/attendanceService.js'
import { getUnitService } from '../services/unitService.js'

function parseOptionalUnitId(unitId: unknown): string | undefined {
  if (typeof unitId !== 'string' || unitId.trim() === '') return undefined
  return unitId.trim()
}

export const getDashboardStatusCards = async (req: Request, res: Response) => {
  const { unitId, userId, level, period, referenceDate } = req.query
  const ref =
    typeof referenceDate === 'string' && referenceDate.length > 0
      ? referenceDate
      : undefined

  const unit = await getUnitService({ unitId: String(unitId) })

  async function getAdminData(): Promise<IAdminStatusCard | undefined> {
    try {
      const [
        entries,
        inAttendance,
        attended,
        occupancy,
        averageTime,
        highRisk
      ] = await Promise.all([
        getEntries({
          unitId: String(unitId),
          period: String(period),
          referenceDate: ref
        }),
        getInAttendance({
          unitId: String(unitId),
          period: String(period),
          referenceDate: ref
        }),
        getAttended({
          unitId: String(unitId),
          period: String(period),
          referenceDate: ref
        }),
        getAttendanceOcuppation({
          unitId: String(unitId),
          maxOccupancy: Number(unit.data?.maxOccupancy),
          period: String(period),
          referenceDate: ref
        }),
        getAverageTime({
          unitId: String(unitId),
          period: String(period),
          referenceDate: ref
        }),
        getHighRisk({
          unitId: String(unitId),
          period: String(period),
          referenceDate: ref
        })
      ])

      if (
        entries === undefined ||
        inAttendance === undefined ||
        attended === undefined ||
        occupancy === undefined ||
        averageTime === undefined ||
        highRisk === undefined
      ) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return {
        entries,
        inAttendance,
        attended,
        occupancy,
        averageTime,
        highRisk
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getDoctorData(): Promise<IDoctorStatusCard | undefined> {
    try {
      const [waitingPatients, attended, averageTime, assertiveness] =
        await Promise.all([
          getWaitingForDoctor({
            unitId: String(unitId)
          }),
          getAttended({
            unitId: String(unitId),
            period: String(period),
            doctorId: String(userId),
            referenceDate: ref
          }),
          getDoctorAverageTime({
            unitId: String(unitId),
            period: String(period),
            doctorId: String(userId),
            referenceDate: ref
          }),
          getDoctorIAAssertiveness({
            unitId: String(unitId),
            period: String(period),
            doctorId: String(userId),
            referenceDate: ref
          })
        ])

      if (
        waitingPatients === undefined ||
        attended === undefined ||
        averageTime === undefined ||
        assertiveness === undefined
      ) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return {
        waitingPatients,
        attended,
        averageTime,
        assertiveness
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getNurseData(): Promise<INurseStatusCard | undefined> {
    try {
      const [waitingPatients, triagedPatients, averageTime] = await Promise.all(
        [
          getWaitingForTriage({
            unitId: String(unitId)
          }),
          getTriaged({
            unitId: String(unitId),
            period: String(period),
            nurseId: String(userId),
            referenceDate: ref
          }),
          getTriageAverageTime({
            unitId: String(unitId),
            period: String(period),
            nurseId: String(userId),
            referenceDate: ref
          })
        ]
      )

      if (
        waitingPatients === undefined ||
        triagedPatients === undefined ||
        averageTime === undefined
      ) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return {
        waitingPatients,
        triagedPatients,
        averageTime
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getMeditData(): Promise<IMeditStatusCard | undefined> {
    try {
      const [entries, inAttendance, attended, averageTime, highRisk] =
        await Promise.all([
          getEntries({
            period: String(period),
            referenceDate: ref
          }),
          getInAttendance({
            period: String(period),
            referenceDate: ref
          }),
          getAttended({
            period: String(period),
            referenceDate: ref
          }),
          getAverageTime({
            period: String(period),
            referenceDate: ref
          }),
          getHighRisk({
            period: String(period),
            referenceDate: ref
          })
        ])

      if (
        entries === undefined ||
        inAttendance === undefined ||
        attended === undefined ||
        averageTime === undefined ||
        highRisk === undefined
      ) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return {
        entries,
        inAttendance,
        attended,
        averageTime,
        highRisk
      }
    } catch (err) {
      console.error(err)
    }
  }

  const data: () => Promise<IDashboardStatusCards | undefined> = async () => {
    switch (level) {
      case UserLevels.MEDIT:
        return await getMeditData()
      case UserLevels.ADMIN:
        return await getAdminData()
      case UserLevels.DOCTOR:
        return await getDoctorData()
      case UserLevels.NURSE:
        return await getNurseData()
      default:
        return
    }
  }

  try {
    res.json({
      message: 'Dados do dashboard carregados com sucesso',
      data: await data()
    })
  } catch (errors) {
    res.status(500).json({
      message: 'Erro ao buscar dados do dashboard',
      errors
    })
  }
}

export const getDashboardAttendanceByTime = async (
  req: Request,
  res: Response
) => {
  try {
    const { unitId, period, referenceDate, level } = req.query
    const ref =
      typeof referenceDate === 'string' && referenceDate.length > 0
        ? referenceDate
        : undefined

    const unitIdStr = parseOptionalUnitId(unitId)
    const levelStr = typeof level === 'string' ? level : undefined

    if (!unitIdStr && levelStr !== UserLevels.MEDIT) {
      return res.status(400).json({
        message: 'ID da unidade é obrigatório para este perfil'
      })
    }

    const data = await getAttendanceByTime({
      unitId: unitIdStr,
      period: String(period),
      referenceDate: ref
    })

    res.json({
      message: 'Atendimentos por hora carregados com sucesso',
      data
    })
  } catch (errors) {
    res.status(500).json({
      message: 'Erro ao buscar atendimentos por hora',
      errors
    })
  }
}

export const getDashboardAttendanceQueue = async (
  req: Request,
  res: Response
) => {
  try {
    const { unitId, level, period, referenceDate } = req.query
    const ref =
      typeof referenceDate === 'string' && referenceDate.length > 0
        ? referenceDate
        : undefined

    const unitIdStr = parseOptionalUnitId(unitId)
    const levelValue = level ? (level as UserLevels) : undefined

    if (!unitIdStr && levelValue !== UserLevels.MEDIT) {
      return res.status(400).json({
        message: 'ID da unidade é obrigatório para este perfil'
      })
    }

    const data = await getAttendanceQueue({
      unitId: unitIdStr,
      level: levelValue,
      period: typeof period === 'string' ? period : undefined,
      referenceDate: ref
    })

    res.json({
      message: 'Fila de atendimento carregada com sucesso',
      data
    })
  } catch (errors) {
    res.status(500).json({
      message: 'Erro ao buscar fila de atendimento',
      errors
    })
  }
}
