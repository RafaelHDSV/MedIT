import MedicationModel from '../models/MedicationModel.js'

export const getMedicationsByUnitService = async (unitId: string) => {
  const medications = await MedicationModel.find({ unitId }).sort({ name: 1 })
  return { status: 200, message: 'Medicamentos encontrados', data: medications }
}

export const createMedicationService = async (data: any) => {
  const newMedication = new MedicationModel(data)
  await newMedication.save()
  return { status: 201, message: 'Medicamento criado com sucesso', data: newMedication }
}
