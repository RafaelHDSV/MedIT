import UnitModel from '../models/UnitModel.js'

export const getUnitService = async (unitId: string) => {
  const unit = await UnitModel.findById(unitId)
  if (!unit) {
    return { status: 404, message: 'Unidade de saúde não encontrada' }
  }

  return { status: 200, message: 'Unidade de saúde encontrada', data: unit }
}
