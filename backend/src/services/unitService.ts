import { Unit } from '../models/UnitModel.js'

export const getUnitService = async ({ unitId }: { unitId: string }) => {
  const unit = await Unit.findById(unitId)
  if (!unit) {
    return { status: 404, message: 'Unidade de saúde não encontrada' }
  }

  return { status: 200, message: 'Unidade de saúde encontrada', data: unit }
}

export const getAllUnitsService = async () => {
  const units = await UnitModel.find().sort({ name: 1 })
  return { status: 200, message: 'Unidades de saúde encontradas', data: units }
}

export const createUnitService = async (unitData: any) => {
  const newUnit = new UnitModel(unitData)
  await newUnit.save()
  return { status: 201, message: 'Unidade criada com sucesso', data: newUnit }
}
