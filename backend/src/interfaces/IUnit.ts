import { IBaseInterface } from './IBaseInterface'

export interface IUnit extends IBaseInterface {
  name: string
  address: string
  maxOccupancy: number
  openingHours: {
    [day: string]: {
      open: string
      close: string
    }[]
  }
  phone?: string
}
