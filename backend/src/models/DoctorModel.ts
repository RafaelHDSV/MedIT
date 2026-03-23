import mongoose from 'mongoose'
import { DoctorSpecializations, IDoctor } from '../interfaces/IDoctor.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true },
  specialization: {
    type: String,
    required: true,
    enum: Object.values(DoctorSpecializations),
    lowercase: true
  }
})

export const Doctor = mongoose
  .model<IBaseUser>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)
