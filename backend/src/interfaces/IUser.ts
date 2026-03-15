import { IBaseInterface } from './IBaseInterface.js'

export const Roles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT'
} as const
export type Roles = (typeof Roles)[keyof typeof Roles]

export interface IUser extends IBaseInterface {
  name: string
  role: Roles
  email: string
  password?: string
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}