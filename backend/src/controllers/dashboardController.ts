import { Request, Response } from 'express'
import { IDashboardStatusCards } from '../interfaces/IDashboardStatusCards.js'
import { getUnitService } from '../services/unitServices.js'

// TODO: Atualizar os dados para serem dinâmicos, utilizando os dados reais da unidade de saúde
export const getDashboardStatusCards = async (req: Request, res: Response) => {
  const { unitId } = req.query

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

  const data: IDashboardStatusCards = {
    admin: adminData,
    doctor: doctorData,
    nurse: nurseData
  }

  res.json({
    message: 'Cards de status do dashboard encontrados com sucesso',
    data
  })
}
