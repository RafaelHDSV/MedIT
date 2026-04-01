import mongoose from 'mongoose'
import { IDoctor } from '../interfaces/IDoctor'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true, unique: true },
  specialization: {
    type: String,
    required: true,
    lowercase: true
  }
})

export default DoctorSchema
