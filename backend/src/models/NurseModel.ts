import mongoose from 'mongoose'
import { INurse } from '../interfaces/INurse.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'

const NurseSchema = new mongoose.Schema<INurse>({
  coren: { type: String, required: true },
  shift: { type: String, required: true }
})

export const Nurse = mongoose
  .model<IBaseUser>('User')
  .discriminator(UserLevels.NURSE, NurseSchema)
