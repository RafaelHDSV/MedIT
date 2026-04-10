import { IBaseInterface } from './IBaseInterface.js'

type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

type TimeString = `${number}${number}:${number}${number}`

interface IOpeningHour {
  open: TimeString
  close: TimeString
}

type OpeningHours = Record<WeekDay, IOpeningHour>

interface IAddress {
  street: string
  number: number
  neighborhood: string
  city: string
  state: string
}

export interface IUnit extends IBaseInterface {
  name: string
  address: IAddress
  maxOccupancy: number
  openingHours: OpeningHours
  phone: string
}
