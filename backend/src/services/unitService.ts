import { Unit } from '../models/UnitModel.js'

export const getUnitService = async ({ unitId }: { unitId: string }) => {
  const unit = await Unit.findById(unitId)
  if (!unit) {
    return { status: 404, message: 'Unidade de saúde não encontrada' }
  }

  return { status: 200, message: 'Unidade de saúde encontrada', data: unit }
}

export const createUnitService = async (unitData: any) => {
  const newUnit = new Unit(unitData)
  await newUnit.save()
  return { status: 201, message: 'Unidade criada com sucesso', data: newUnit }
}
