import mongoose from 'mongoose'
import { IDoctor } from '../interfaces/IDoctor.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import { UserModel } from './UserModel.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true, unique: true },
  specialization: {
    type: String,
    required: true,
    lowercase: true
  }
})

export const Doctor = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)
