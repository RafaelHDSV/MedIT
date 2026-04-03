import { IBaseInterface } from "./IBaseInterface.js"

export interface IMedication extends IBaseInterface {
  name: string
  dosage: string
  frequency: string
  route: string
  duration: string
}