import mongoose from 'mongoose'
import { ISympyomsDiseases } from '../interfaces/ISympyomsDiseases.js'

const SympyomsDiseaseSchema = new mongoose.Schema<ISympyomsDiseases>(
  {
    disease: {
      type: String,
      required: true,
      unique: true
    },
    symptoms: { type: Map, of: Number, required: true }
  },
  { timestamps: true }
)

export default SympyomsDiseaseSchema
