import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import {
  MedicationAvailabilityStatus,
  MedicationCategories
} from '../interfaces/IMedications.js'
import MedicationModel from '../models/MedicationModel.js'

export const getMedicationsByUnit = async (req: Request, res: Response) => {
  const { unitId } = req.params

  try {
    const medications = await MedicationModel.find({ unitId }).sort({
      createdAt: -1
    })
    if (!medications || medications.length === 0) {
      return res.status(404).json({ message: 'Nenhum medicamento encontrado' })
    }
    return res
      .status(200)
      .json({ message: 'Medicamentos encontrados', data: medications })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar medicamentos' })
  }
}

export const createMedication = async (req: Request, res: Response) => {
  const body = req.body
  const {
    name,
    category,
    description,
    requiresPrescription,
    stockQuantity,
    unitId
  } = body

  const errors: Record<string, string> = {}

  if (!name) errors.name = 'Nome é obrigatório'
  if (!category) errors.category = 'Categoria é obrigatório'
  if (!description) errors.description = 'Descrição é obrigatório'
  if (requiresPrescription === undefined)
    errors.requiresPrescription = 'Necessita de receita médica é obrigatório'
  if (stockQuantity === undefined)
    errors.stockQuantity = 'Quantidade em estoque é obrigatório'
  if (!unitId) errors.unitId = 'Unidade é obrigatório'

  if (Object.keys(errors).length > 0) {
    return res
      .status(400)
      .json({ message: 'Erro de validações na criação do medicamento', errors })
  }
  if (name && name.length < 3)
    errors.name = 'Nome deve ter pelo menos 3 caracteres'
  if (category && !Object.values(MedicationCategories).includes(category))
    errors.category = 'Categoria inválida'
  if (description && description.length < 3)
    errors.description = 'Descrição deve ter pelo menos 3 caracteres'
  if (requiresPrescription && typeof requiresPrescription !== 'boolean')
    errors.requiresPrescription =
      'Necessita de receita médica deve ser um booleano'
  if (stockQuantity && typeof stockQuantity !== 'number')
    errors.stockQuantity = 'Quantidade em estoque deve ser um número'
  if (unitId && !isValidObjectId(unitId)) errors.unitId = 'Unidade inválida'

  if (Object.keys(errors).length > 0) {
    return res
      .status(400)
      .json({ message: 'Erro de validações na criação do medicamento', errors })
  }

  function getAvailabilityStatusByStockQuantity(
    stockQuantity: number
  ): MedicationAvailabilityStatus {
    if (stockQuantity >= 30) return MedicationAvailabilityStatus.AVAILABLE
    if (stockQuantity > 0) return MedicationAvailabilityStatus.LOW_STOCK
    return MedicationAvailabilityStatus.UNAVAILABLE
  }

  try {
    const availabilityStatus =
      getAvailabilityStatusByStockQuantity(stockQuantity)

    const medication = new MedicationModel({
      name,
      category,
      description,
      requiresPrescription,
      availabilityStatus,
      stockQuantity,
      unitId
    })
    await medication.save()

    return res
      .status(201)
      .json({ message: 'Medicamento criado com sucesso', data: medication })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ message: 'Erro ao criar medicamento', error: err })
  }
}
