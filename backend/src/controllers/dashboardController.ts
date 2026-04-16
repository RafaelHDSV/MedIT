import { Request, Response } from 'express'
import {
  IAdminStatusCard,
  IDashboardStatusCards,
  IDoctorStatusCard,
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
  getEntries,
  getHighRisk,
  getInAttendance,
  getTriageAverageTime,
  getTriaged,
  getWaitingForDoctor,
  getWaitingForTriage
} from '../services/attendanceService.js'
import { getUnitService } from '../services/unitService.js'

export const getDashboardStatusCards = async (req: Request, res: Response) => {
  const { unitId, userId, level, period } = req.query

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
          period: String(period)
        }),
        getInAttendance({
          unitId: String(unitId)
        }),
        getAttended({
          unitId: String(unitId),
          period: String(period)
        }),
        getAttendanceOcuppation({
          unitId: String(unitId),
          maxOccupancy: Number(unit.data?.maxOccupancy)
        }),
        getAverageTime({
          unitId: String(unitId),
          period: String(period)
        }),
        getHighRisk({
          unitId: String(unitId),
          period: String(period)
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
      const [waitingPatients, attended, averageTime] = await Promise.all([
        getWaitingForDoctor({
          unitId: String(unitId)
        }),
        getAttended({
          unitId: String(unitId),
          period: String(period),
          doctorId: String(userId)
        }),
        getDoctorAverageTime({
          unitId: String(unitId),
          period: String(period),
          doctorId: String(userId)
        })
      ])

      if (
        waitingPatients === undefined ||
        attended === undefined ||
        averageTime === undefined
      ) {
        throw new Error('Erro ao buscar dados do dashboard')
      }

      return {
        waitingPatients,
        attended,
        averageTime,
        // VIEIRA: Adicionar assertividade IA
        assertiveness: 0
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
            nurseId: String(userId)
          }),
          getTriageAverageTime({
            unitId: String(unitId),
            period: String(period),
            nurseId: String(userId)
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

  const data: () => Promise<IDashboardStatusCards | undefined> = async () => {
    switch (level) {
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
    const { unitId, period } = req.query

    const data = await getAttendanceByTime({
      unitId: String(unitId),
      period: String(period)
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
    const { unitId } = req.query

    const data = await getAttendanceQueue({
      unitId: String(unitId)
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
