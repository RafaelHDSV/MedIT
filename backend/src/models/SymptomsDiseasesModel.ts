import mongoose from 'mongoose'
import { ISymptomsDiseases } from '../interfaces/ISymptomsDiseases.js'
import SymptomsDiseaseSchema from '../schema/SymptomsDiseaseSchema.js'

export default mongoose.model<ISymptomsDiseases>(
  'SympyotsDisease',
  SymptomsDiseaseSchema
)
