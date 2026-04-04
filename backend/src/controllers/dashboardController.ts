import { Request, Response } from 'express'
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
  getWaitingForDoctor
} from '../services/attendanceService.js'
import { getUnitService } from '../services/unitService.js'

export const getDashboardStatusCards = async (req: Request, res: Response) => {
  const { unitId, userId, level, period } = req.query

  const unit = await getUnitService({ unitId: String(unitId) })

  async function getAdminData() {
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

  async function getDoctorData() {
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

  async function getNurseData() {
    const [waitingPatients, triagedPatients, averageTime] = await Promise.all([
      getWaitingForDoctor({
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
    ])

    try {
      return {
        waitingPatients,
        triagedPatients,
        averageTime
      }
    } catch (err) {
      console.error(err)
    }
  }

  const data = async () => {
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
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar dados do dashboard'
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
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar atendimentos por hora'
    })
  }
}

export const getDashboardAttendanceQueue = async (
  req: Request,
  res: Response
) => {
  try {
    const { unitId, period } = req.query

    const data = await getAttendanceQueue({
      unitId: String(unitId),
      period: String(period)
    })

    res.json({
      message: 'Fila de atendimento carregada com sucesso',
      data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar fila de atendimento'
    })
  }
}
