import { IBaseInterface } from './IBaseInterface.js'

export interface ISympyomsDiseases extends IBaseInterface {
  disease: string
  symptoms: Record<string, number>
}
