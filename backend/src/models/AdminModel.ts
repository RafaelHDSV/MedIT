import mongoose from 'mongoose'
import { IAdmin } from '../interfaces/IAdmin.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import { UserModel } from './UserModel.js'

const AdminSchema = new mongoose.Schema<IAdmin>()

export const Admin = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.ADMIN, AdminSchema)
