import { IBaseInterface } from './IBaseInterface.js'

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type TimeString = `${number}${number}:${number}${number}`

export interface IOpeningHour {
  open: TimeString
  close: TimeString
}

export type OpeningHours = Record<WeekDay, IOpeningHour>

export interface IUnit extends IBaseInterface {
  name: string
  address: string
  maxOccupancy?: number
  scale?: string
  openingHours?: OpeningHours
  phone?: string
}
