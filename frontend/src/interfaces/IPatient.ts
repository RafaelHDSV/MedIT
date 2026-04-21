import type { Dayjs } from 'dayjs'
import type { IBaseUser, UserGender } from './IUser'

export const BloodType = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-'
} as const
export type BloodType = (typeof BloodType)[keyof typeof BloodType]

export interface IPatient extends IBaseUser {
  weight?: number
  height?: number
  bloodType?: BloodType
  conditions?: string[]
  allergies?: string[]
}

export interface PatientSignupBody {
  name: string
  cpf: string
  email: string
  password: string
  unitId: string
}

export interface PatientFormValues {
  name: string
  cpf: string
  birthDate: Dayjs | null
  gender: UserGender
  email: string
  currentPassword?: string
  newPassword?: string
  cellphone: string
  weight?: number
  height?: number
  bloodType?: BloodType
  conditions?: string[]
  allergies?: string[]
}

export interface IPatientFormErrors {
  name?: string
  cpf?: string
  birthDate?: string
  gender?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  cellphone?: string
  weight?: string
  height?: string
  bloodType?: string
  conditions?: string
  allergies?: string
}
