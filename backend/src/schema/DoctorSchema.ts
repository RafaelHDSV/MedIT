import mongoose from 'mongoose'
import { IDoctor } from '../interfaces/IDoctor.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true, unique: true },
  specialization: {
    type: String,
    required: true,
    lowercase: true
  },
  workLocationLabel: {
    type: String,
    trim: true,
    maxlength: 120
  }
})

export default DoctorSchema
