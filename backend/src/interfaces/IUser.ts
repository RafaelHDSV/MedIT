import { ObjectId } from 'mongoose'
import { IBaseInterface } from './IBaseInterface.js'

export const UserLevels = {
  MEDIT: 'medit',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient'
} as const
export type UserLevels = (typeof UserLevels)[keyof typeof UserLevels]

export const UserGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]

export interface IBaseUser extends IBaseInterface {
  name: string
  cpf: string
  level: UserLevels
  email: string
  password?: string
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
  unitId?: ObjectId
  refreshToken?: string
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}
