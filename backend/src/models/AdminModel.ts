import mongoose from 'mongoose'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import AdminSchema from '../schema/AdminSchema.js'
import { User } from './UserModel.js'

export const Admin = mongoose
  .model<IBaseUser, User>('User')
  .discriminator(UserLevels.ADMIN, AdminSchema)
