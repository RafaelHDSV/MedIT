import type { IBaseInterface } from './IBaseInterface'
import type { IDoctor } from './IDoctor'
import type { INurse } from './INurse'
import type { IPatient } from './IPatient'

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

export type IAuthUser = IBaseUser & IDoctor & INurse & IPatient

export interface IBaseUser extends IBaseInterface {
  name: string
  cpf: string
  level: UserLevels
  email: string
  password?: string
  gender?: UserGender
  cellphone?: number
  birthDate?: Date
  unitId?: string
  refreshToken?: string
}
