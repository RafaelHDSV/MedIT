import { IBaseInterface } from './IBaseInterface.js'

export const UserLevels = {
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

const BloodType = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-'
} as const
type BloodType = (typeof BloodType)[keyof typeof BloodType]

export interface IBaseUser extends IBaseInterface {
  name: string
  cpf: string
  level: UserLevels
  email: string
  password?: string
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
  refreshToken?: string
}

export interface IDoctor extends IBaseUser {
  crm: string
  specialization: string
}

export interface INurse extends IBaseUser {
  coren: string
  shift: string
}

export interface IPatient extends IBaseUser {
  weight?: number
  height?: number
  bloodType?: BloodType
  conditions?: string[]
  allergies?: string[]
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}
