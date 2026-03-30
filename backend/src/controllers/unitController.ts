import { Request, Response } from 'express'
import { getUnitService } from '../services/unitServices'

export const getUnit = async (req: Request, res: Response) => {
  const { id } = req.query

  try {
    const unit = await getUnitService(id as string)
    if (unit.status !== 200) {
      return res.status(unit.status).json({ message: unit.message })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar unidade de saúde' })
  }
}
