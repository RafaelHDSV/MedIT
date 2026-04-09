import { Request, Response } from 'express'
import { Unit } from '../models/UnitModel.js'
import { createUnitService, getUnitService } from '../services/unitService.js'

export const getUnits = async (req: Request, res: Response) => {
  try {
    const units = await Unit.find().sort({ createdAt: 1 })
    if (!units || units.length === 0) {
      return res.status(404).json({ message: 'Nenhuma unidade encontrada' })
    }

    res.json(units)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidades de saúde' })
  }
}

export const getUnit = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const units = await getUnitService({ unitId: id as string })
    if (units.status !== 200) {
      return res.status(units.status).json({ message: units.message })
    }
    return res.json({
      message: 'Unidades encontradas com sucesso!',
      data: units
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidade de saúde' })
  }
}

export const createUnit = async (req: Request, res: Response) => {
  try {
    const response = await createUnitService(req.body)
    return res
      .status(response.status)
      .json({ message: response.message, data: response.data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao criar unidade de saúde' })
  }
}
