import mongoose from 'mongoose'
import { IUnit } from '../interfaces/IUnit.js'
import UnitSchema from '../schema/UnitSchema.js'

export type UnitModel = mongoose.Model<IUnit>
export default mongoose.model<IUnit, UnitModel>('Unit', UnitSchema)
