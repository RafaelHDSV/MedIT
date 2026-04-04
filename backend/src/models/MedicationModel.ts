import mongoose from 'mongoose'
import { IMedication } from '../interfaces/IMedications.js'
import MedicationSchema from '../schema/MedicationSchema.js'

export type Medication = mongoose.Model<IMedication>
export default mongoose.model<IMedication, Medication>(
  'Medication',
  MedicationSchema
)
