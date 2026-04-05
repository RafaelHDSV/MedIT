import { IBaseInterface } from './IBaseInterface.js'

export interface ISymptomsDiseases extends IBaseInterface {
  disease: string
  symptoms: Record<string, number>
}
