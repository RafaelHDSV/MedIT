import { Date, ObjectId } from 'mongoose'

export interface IBaseInterface {
  _id?: ObjectId
  number?: number
  createdAt?: Date
  updatedAt?: Date
}
