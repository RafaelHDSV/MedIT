import type { IBaseInterface } from './IBaseInterface'

export const UserRoles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT'
} as const
export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles]
export const UserRolesLabels = {
  ADMIN: 'Administrador(a)',
  DOCTOR: 'Médico(a)',
  NURSE: 'Enfermeiro(a)',
  PATIENT: 'Paciente'
} as const

export const UserGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const
export type UserGender = (typeof UserGender)[keyof typeof UserGender]
export const UserGendersLabels = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro'
} as const

export interface IUser extends IBaseInterface, IDoctor, INurse, IPatient {
  name: string
  cpf: string
  role: UserRoles
  number: number
  email: string
  password?: string
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
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
