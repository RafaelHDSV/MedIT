import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import DoctorSchema from '../schema/DoctorSchema.js'
import { UserModel } from './UserModel.js'

export const Doctor = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)
