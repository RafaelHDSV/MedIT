import type { IBaseInterface } from './IBaseInterface'

type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

type TimeString = `${number}${number}:${number}${number}`

interface IOpeningHour {
  open: TimeString
  close: TimeString
}

type OpeningHours = Record<WeekDay, IOpeningHour>

export interface IUnit extends IBaseInterface {
  name: string
  address: string
  maxOccupancy: number
  openingHours: OpeningHours
  phone: string
}
