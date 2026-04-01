import mongoose from 'mongoose'
import { IMedication } from '../interfaces/IMedications'
import MedicationSchema from '../schema/Medicationschema'

export type MedicationModel = mongoose.Model<IMedication>
export default mongoose.model<IMedication, MedicationModel>(
  'Medication',
  MedicationSchema
)
