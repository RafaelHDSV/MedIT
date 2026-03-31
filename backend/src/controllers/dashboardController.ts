import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
import { AttendanceRisk } from '../interfaces/IAttendance.js'
import { getUnitService } from '../services/unitServices.js'

// TODO: Atualizar os dados para serem dinâmicos, utilizando os dados reais da unidade de saúde
export const getDashboardStatusCards = async (req: Request, res: Response) => {
  const { unitId, level } = req.query

  const unit = await getUnitService(unitId as string)
  const occupied = 47
  const maxOccupancy = unit.data?.maxOccupancy || 0
  const occupancyRate = Math.round((occupied / maxOccupancy) * 100)

  const adminData = {
    entries: 142,
    inAttendance: 46,
    attended: 96,
    occupancy: occupancyRate,
    averageTime: 23,
    highRisk: 8
  }

  const doctorData = {
    waitingPatients: 14,
    attended: 96,
    averageTime: 18,
    assertiveness: 52
  }

  const nurseData = {
    waitingPatients: 25,
    triagedPatients: 96,
    averageTime: 18
  }

  const data = () => {
    switch (level) {
      case 'admin':
        return adminData
      case 'doctor':
        return doctorData
      case 'nurse':
        return nurseData
      default:
        return
    }
  }

  res.json({
    message: 'Cards de status do dashboard encontrados com sucesso',
    data: data()
  })
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
