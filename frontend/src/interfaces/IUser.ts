import type { IBaseInterface } from './IBaseInterface'

export const UserLevels = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient'
} as const
export type UserLevels = (typeof UserLevels)[keyof typeof UserLevels]
export const UserLevelsLabels = {
  [UserLevels.ADMIN]: 'Administrador(a)',
  [UserLevels.DOCTOR]: 'Médico(a)',
  [UserLevels.NURSE]: 'Enfermeiro(a)',
  [UserLevels.PATIENT]: 'Paciente'
} as const

export const UserGender = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]
export const UserGendersLabels = {
  [UserGender.MALE]: 'Masculino',
  [UserGender.FEMALE]: 'Feminino',
  [UserGender.OTHER]: 'Outro'
} as const

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
  number: number
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

export interface ITriagem extends IBaseInterface {
  name: string
  idade: string
  queixa: string
  data: string
  risco: 'Alto' | 'Médio' | 'Baixo'
}

