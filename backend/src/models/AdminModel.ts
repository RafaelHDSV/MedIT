import { UserLevels } from '../interfaces/IUser.js'
import AdminSchema from '../schema/AdminSchema.js'
import UserModel from './UserModel.js'

export const Admin = UserModel.discriminator(UserLevels.ADMIN, AdminSchema)
