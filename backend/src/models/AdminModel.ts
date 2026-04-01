import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import AdminSchema from '../schema/AdminSchema.js'
import { UserModel } from './UserModel.js'

export const Admin = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.ADMIN, AdminSchema)
