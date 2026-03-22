import { IBaseUser } from './IUser.js'

export interface IDoctor extends IBaseUser {
  crm: string
  specialization: string
}
