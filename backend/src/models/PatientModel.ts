import mongoose from 'mongoose'
import { BloodType, IPatient } from '../interfaces/IPatient.js'
import { IBaseUser, UserLevels } from '../interfaces/IUser.js'
import { UserModel } from './UserModel.js'

const PatientSchema = new mongoose.Schema<IPatient>({
  weight: Number,
  height: Number,
  bloodType: { type: String, enum: Object.values(BloodType) },
  conditions: [String],
  allergies: [String]
})

export const Patient = mongoose
  .model<IBaseUser, UserModel>('User')
  .discriminator(UserLevels.PATIENT, PatientSchema)
