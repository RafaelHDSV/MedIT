import { Request, Response } from 'express'
import { Unit } from '../models/UnitModel.js'

export const getUnits = async (req: Request, res: Response) => {
  const { activeUnitId } = req.query
  if (!activeUnitId) {
    return res.status(400).json({ message: 'ID da unidade não informado!' })
  }

  try {
    const activeUnit =
      await Unit.findById(activeUnitId).select('partnerUnitIds')
    if (!activeUnit) {
      return res.status(404).json({ message: 'Unidade ativa não encontrada' })
    }

    const partnerUnitIds = [...activeUnit.partnerUnitIds, activeUnitId]
    if (!partnerUnitIds || partnerUnitIds.length === 0) {
      return res.status(200).json({ message: 'Não existem unidades parceiras' })
    }

    const units = await Unit.find({
      _id: { $in: partnerUnitIds }
    } as any).sort({ createdAt: -1 })
    if (!units || units.length === 0) {
      return res.status(404).json({ message: 'Nenhuma unidade encontrada' })
    }

    res
      .status(200)
      .json({ message: 'Unidades encontradas com sucesso!', data: units })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao buscar unidades de saúde', errors })
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
        .json({ message: 'Unidade de saúde não encontrada', id })
    }

    return res.status(200).json({
      message: 'Unidade encontrada com sucesso!',
      data: unit
    })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao buscar unidade de saúde', errors })
  }
}

export const createUnit = async (req: Request, res: Response) => {
  try {
    const unit = new Unit(req.body)
    await unit.save()

    return res
      .status(201)
      .json({ message: 'Unidade criada com sucesso', data: unit })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao criar unidade de saúde', errors })
  }
}
