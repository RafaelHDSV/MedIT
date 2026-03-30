import { Request, Response } from 'express'
import UnitModel from '../models/UnitModel'

export const getUnit = async (req: Request, res: Response) => {
  const { id } = req.params

  const unit = await UnitModel.findById(id)
  if (!unit) {
    return res.status(404).json({ message: 'Unidade de saúde não encontrada' })
  }

  return res
    .status(200)
    .json({ message: 'Unidade de saúde encontrada', data: unit })
}
