import { Request, Response } from 'express'
import { UserLevels } from '../interfaces/IUser.js'
import { Unit } from '../models/UnitModel.js'
import User from '../models/UserModel.js'

export const getAllUnits = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('level')
    if (!user || user.level !== UserLevels.MEDIT) {
      return res
        .status(403)
        .json({ message: 'Acesso negado: apenas nível MedIT' })
    }

    const { search } = req.query
    const filter: Record<string, unknown> = {}

    if (typeof search === 'string' && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' }
    }

    const units = await Unit.find(filter).sort({ name: 1 })

    return res
      .status(200)
      .json({ message: 'Unidades encontradas com sucesso!', data: units })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao buscar unidades de saúde', errors })
  }
}

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
    } as any).sort({ name: 1 })
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

export const getSignupUnitsList = async (_req: Request, res: Response) => {
  try {
    const units = await Unit.find().select('_id name').sort({ name: 1 }).lean()

    return res.status(200).json({
      message: 'Unidades encontradas com sucesso!',
      data: units
    })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao buscar unidades de saúde', errors })
  }
}

export const createUnit = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('level')
    if (!user || user.level !== UserLevels.MEDIT) {
      return res
        .status(403)
        .json({ message: 'Apenas o nível MedIT pode criar unidades' })
    }

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

export const editUnit = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('level')
    if (!user || user.level !== UserLevels.MEDIT) {
      return res
        .status(403)
        .json({ message: 'Apenas o nível MedIT pode editar unidades' })
    }

    const { id } = req.params
    const unit = await Unit.findById(id)
    if (!unit) {
      return res.status(404).json({ message: 'Unidade não encontrada' })
    }

    const { name, address, maxOccupancy, openingHours, phone, partnerUnitIds } =
      req.body ?? {}

    if (name !== undefined) unit.name = name
    if (address !== undefined) unit.set('address', address)
    if (maxOccupancy !== undefined) unit.maxOccupancy = maxOccupancy
    if (openingHours !== undefined) unit.set('openingHours', openingHours)
    if (phone !== undefined) unit.phone = phone
    if (partnerUnitIds !== undefined) unit.partnerUnitIds = partnerUnitIds

    await unit.save()

    return res
      .status(200)
      .json({ message: 'Unidade atualizada com sucesso', data: unit })
  } catch (errors) {
    console.error(errors)
    return res
      .status(500)
      .json({ message: 'Erro ao editar unidade de saúde', errors })
  }
}
