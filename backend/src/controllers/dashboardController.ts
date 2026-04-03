import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
import { AttendanceRisk } from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import {
  getAttendanceOcuppation,
  getAttended,
  getAverageTime,
  getEntries,
  getHighRisk,
  getInAttendance,
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
      const [waitingPatients, attended] = await Promise.all([
        getWaitingForDoctor({
          unitId: String(unitId)
        }),
        getAttended({
          unitId: String(unitId),
          period: String(period),
          doctorId: String(userId)
        })
      ])
      return {
        waitingPatients,
        attended,
        averageTime: 18,
        assertiveness: 0
      }
    } catch (err) {
      console.error(err)
    }
  }
  async function getNurseData() {
    try {
      return {
        waitingPatients: 25,
        triagedPatients: 96,
        averageTime: 18
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
    const data = Array.from({ length: 12 }).map((_, hour) => ({
      hour,
      total: Math.floor(Math.random() * 200)
    }))

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
    const data = faker.helpers.multiple(
      () => ({
        _id: faker.string.uuid(),
        patientName: faker.person.fullName(),
        status: faker.helpers.arrayElement([
          'Em transporte',
          'Entrada',
          'Aguardando Triagem',
          'Em Triagem',
          'Aguardando Médico',
          'Em Atendimento',
          'Aguardando Exames',
          'Aguardando Resultados',
          'Aguardando Alta'
        ]),
        risk: faker.helpers.arrayElement(Object.values(AttendanceRisk))
      }),
      { count: 66 }
    )

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
