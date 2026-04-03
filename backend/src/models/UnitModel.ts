import { model } from 'mongoose'
import { IUnit } from '../interfaces/IUnit.js'
import UnitSchema from '../schema/UnitSchema.js'

export const Unit = model<IUnit>('Unit', UnitSchema)
