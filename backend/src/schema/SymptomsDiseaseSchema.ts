import mongoose from 'mongoose'
import { ISymptomsDiseases } from '../interfaces/ISymptomsDiseases.js'

const SymptomsDiseaseSchema = new mongoose.Schema<ISymptomsDiseases>(
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

export default SymptomsDiseaseSchema
