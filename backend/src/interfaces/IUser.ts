import { IBaseInterface } from './IBaseInterface.js'

export const Roles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT'
} as const
export type Roles = (typeof Roles)[keyof typeof Roles]

export const UserGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]

export interface IUser extends IBaseInterface, IDoctor {
  name: string
  cpf: string
  role: Roles
  email: string
  password?: string
  age?: number
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
  refreshToken?: string
}

interface IDoctor {
  crm?: string
  specialization?: string
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}
