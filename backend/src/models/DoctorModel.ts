import mongoose from 'mongoose'
import { IBaseUser, IDoctor } from '../interfaces/IUser.js'

const DoctorSchema = new mongoose.Schema<IDoctor>({
  crm: { type: String, required: true },
  specialization: { type: String, required: true }
})

export const Doctor = mongoose
  .model<IBaseUser>('User')
  .discriminator('DOCTOR', DoctorSchema)