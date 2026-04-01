import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import NurseSchema from '../schema/NurseSchema.js'
import { UserModel } from './UserModel.js'

export const Nurse = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.NURSE, NurseSchema)
