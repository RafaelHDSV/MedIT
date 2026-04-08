import { Request, Response } from 'express'
import { getAllUnitsService, getUnitService, createUnitService } from '../services/unitServices.js'

export const getUnit = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const unit = await getUnitService(id as string)
    if (unit.status !== 200) {
      return res.status(unit.status).json({ message: unit.message })
    }
    return res.status(unit.status).json({ message: unit.message, data: unit.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidade de saúde' })
  }
}

export const getAllUnits = async (req: Request, res: Response) => {
  try {
    const units = await getAllUnitsService()
    return res.status(units.status).json({ message: units.message, data: units.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidades de saúde' })
  }
}

export const createUnit = async (req: Request, res: Response) => {
  try {
    const response = await createUnitService(req.body)
    return res.status(response.status).json({ message: response.message, data: response.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao criar unidade de saúde' })
  }
}
