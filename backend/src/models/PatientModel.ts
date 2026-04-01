import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import PatientSchema from '../schema/PatientSchema.js'
import { User } from './UserModel.js'

export const Patient = mongoose
  .model<IBaseUser, User>('User')
  .discriminator(UserLevels.PATIENT, PatientSchema)
