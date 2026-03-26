import mongoose from 'mongoose'
import { INurse, NurseShifts } from '../interfaces/INurse.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import { UserModel } from './UserModel.js'

const NurseSchema = new mongoose.Schema<INurse>({
  coren: { type: String, required: true, unique: true },
  shift: { type: String, enum: Object.values(NurseShifts), required: true }
})

export const Nurse = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.NURSE, NurseSchema)
