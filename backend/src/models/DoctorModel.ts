import mongoose from 'mongoose'
import { IDoctor } from '../interfaces/IDoctor.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true, unique: true },
  specialization: {
    type: String,
    required: true,
    lowercase: true
  }
})

export const Doctor = mongoose
  .model<IBaseUser>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)
