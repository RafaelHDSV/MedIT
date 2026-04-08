import { Request, Response } from 'express'
import { createMedicationService, getMedicationsByUnitService } from '../services/medicationServices.js'

export const getMedicationsByUnit = async (req: Request, res: Response) => {
  const { unitId } = req.params

  try {
    const result = await getMedicationsByUnitService(unitId as string)
    return res.status(result.status).json({ message: result.message, data: result.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar medicamentos' })
  }
}

export const createMedication = async (req: Request, res: Response) => {
  try {
    const result = await createMedicationService(req.body)
    return res.status(result.status).json({ message: result.message, data: result.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao criar medicamento', error: err })
  }
}
