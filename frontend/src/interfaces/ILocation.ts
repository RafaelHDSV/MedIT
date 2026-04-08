export interface ILocation {
  _id: string
  name: string
  address: string
  openingHours?: {
    [key: string]: {
      open: string
      close: string
    }
  }
  scale?: string
}
