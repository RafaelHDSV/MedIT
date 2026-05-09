import { IBaseUser } from './IUser.js'

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
  workLocationLabel?: string
}
