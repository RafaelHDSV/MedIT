import { IBaseInterface } from './IBaseInterface.js'

export const Levels = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT'
} as const
export type Levels = (typeof Levels)[keyof typeof Levels]

export const UserGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]

export interface IUser extends IBaseInterface, IDoctor, INurse, IPatient {
  name: string
  cpf: string
  level: Levels
  number: number
  email: string
  password?: string
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
  refreshToken?: string
}

interface IDoctor {
  crm?: string
  specialization?: string
}

interface INurse {
  coren?: string
  shift?: string
}

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

interface IPatient {
  weight?: number
  height?: number
  bloodType?: BloodType
  conditions?: string[]
  allergies?: string[]
}


export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>
}
