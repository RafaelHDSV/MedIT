import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import PatientSchema from '../schema/PatientSchema.js'
import { UserModel } from './UserModel.js'

export const Patient = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.PATIENT, PatientSchema)
