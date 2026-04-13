import { UserLevels } from '../interfaces/IUser.js'
import DoctorSchema from '../schema/DoctorSchema.js'
import UserModel from './UserModel.js'

export const Doctor = UserModel.discriminator(UserLevels.DOCTOR, DoctorSchema)
