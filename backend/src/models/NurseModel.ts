import mongoose from 'mongoose'
import { INurse } from '../interfaces/INurse.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import { UserModel } from './UserModel.js'

const NurseSchema = new mongoose.Schema<INurse>({
  coren: { type: String, required: true },
  shift: { type: String, required: true }
})

export const Nurse = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.NURSE, NurseSchema)
