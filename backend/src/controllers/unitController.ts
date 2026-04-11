import { Request, Response } from 'express'
import { Unit } from '../models/UnitModel.js'

export const getUnits = async (_req: Request, res: Response) => {
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
  if (!id) {
    return res.status(400).json({ message: 'ID da unidade não informado!' })
  }

  try {
    const unit = await Unit.findById(id)
    if (!unit) {
      return res
        .status(404)
        .json({ message: 'Unidade de saúde não encontrada' })
    }

    return res.status(200).json({
      message: 'Unidade encontrada com sucesso!',
      data: unit
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidade de saúde' })
  }
}

export const createUnit = async (req: Request, res: Response) => {
  try {
    const unit = new Unit(req.body)
    await unit.save()

    return res
      .status(201)
      .json({ message: 'Unidade criada com sucesso', data: unit })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao criar unidade de saúde' })
  }
}
