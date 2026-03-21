import mongoose from 'mongoose'
import { IBaseUser, IDoctor, UserLevels } from '../interfaces/IUser.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true },
  specialization: { type: String, required: true }
})

export const Doctor = mongoose
  .model<IBaseUser>('User')
  .discriminator(UserLevels.DOCTOR, DoctorSchema)