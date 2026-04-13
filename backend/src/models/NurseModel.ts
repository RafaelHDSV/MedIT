import { UserLevels } from '../interfaces/IUser.js'
import NurseSchema from '../schema/NurseSchema.js'
import UserModel from './UserModel.js'

export const Nurse = UserModel.discriminator(UserLevels.NURSE, NurseSchema)
