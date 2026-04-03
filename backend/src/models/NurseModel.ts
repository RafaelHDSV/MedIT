import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import NurseSchema from '../schema/NurseSchema.js'
import { User } from './UserModel.js'

export const Nurse = mongoose
  .model<IBaseUser, User>('User')
  .discriminator(UserLevels.NURSE, NurseSchema)
