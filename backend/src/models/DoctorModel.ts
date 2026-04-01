import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import DoctorSchema from '../schema/DoctorSchema.js'
import { User } from './UserModel.js'

export const Doctor = mongoose
  .model<IBaseUser, User>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)
