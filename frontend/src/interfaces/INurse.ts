import type { Dayjs } from 'dayjs'
import type { IBaseUser, UserGender } from './IUser'

export const NurseCorenType = {
  ENF: 'ENF',
  TE: 'TE',
  AUX: 'AUX'
} as const
export type NurseCorenType =
  (typeof NurseCorenType)[keyof typeof NurseCorenType]

export const NurseShifts = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  NIGHT: 'night'
} as const
export type NurseShifts = (typeof NurseShifts)[keyof typeof NurseShifts]
export const NurseShiftsLabels = {
  [NurseShifts.MORNING]: 'Manhã',
  [NurseShifts.AFTERNOON]: 'Tarde',
  [NurseShifts.NIGHT]: 'Noite'
} as const

export interface INurse extends IBaseUser {
  coren: string
  shift: NurseShifts
}

export interface NurseFormValues {
  name: string
  cpf: string
  birthDate: Dayjs | null
  gender: UserGender
  email: string
  currentPassword?: string
  newPassword?: string
  password?: string
  cellphone: string
  corenUf: string
  coren: string
  corenType: NurseCorenType
  shift: NurseShifts
}

export interface INurseFormErrors {
  name?: string
  cpf?: string
  birthDate?: string
  gender?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  password?: string
  cellphone?: string
  corenUf?: string
  coren?: string
  corenType?: string
  shift?: string
}
