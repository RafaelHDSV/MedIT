import mongoose from 'mongoose'
import { IBaseUser, IUserMethods } from '../interfaces/IUser.js'
import UserSchema from '../schema/UserSchema.js'

export type UserModel = mongoose.Model<IBaseUser, {}, IUserMethods>
export default mongoose.model<IBaseUser, UserModel>('User', UserSchema)
