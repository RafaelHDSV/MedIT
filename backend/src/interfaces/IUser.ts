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

export interface IUser extends IBaseInterface, IDoctor, INurse, IPatient {
  name: string
  cpf: string
  role: Roles
  number: number
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
