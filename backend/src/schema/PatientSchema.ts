import mongoose from 'mongoose'
import { BloodType, IPatient } from '../interfaces/IPatient.js'

const PatientSchema = new mongoose.Schema<IPatient>({
  weight: Number,
  height: Number,
  bloodType: { type: String, enum: Object.values(BloodType) },
  conditions: [String],
  allergies: [String]
})

export default PatientSchema
