import { UserLevels } from '../interfaces/IUser.js'
import PatientSchema from '../schema/PatientSchema.js'
import UserModel from './UserModel.js'

export const Patient = UserModel.discriminator(
  UserLevels.PATIENT,
  PatientSchema
)
