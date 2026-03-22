import mongoose from 'mongoose'
import { IPatient } from '../interfaces/IPatient.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'

const PatientSchema = new mongoose.Schema<IPatient>({
  weight: Number,
  height: Number,
  bloodType: String,
  conditions: [String],
  allergies: [String]
})

export const Patient = mongoose
  .model<IBaseUser>('User')
  .discriminator(UserLevels.PATIENT, PatientSchema)
