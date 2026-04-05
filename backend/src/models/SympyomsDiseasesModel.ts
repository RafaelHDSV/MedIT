import mongoose from 'mongoose'
import { ISympyomsDiseases } from '../interfaces/ISympyomsDiseases.js'
import SympyomsDiseaseSchema from '../schema/SympyomsDiseaseSchema.js'

export default mongoose.model<ISympyomsDiseases>(
  'SympyomsDisease',
  SympyomsDiseaseSchema
)
