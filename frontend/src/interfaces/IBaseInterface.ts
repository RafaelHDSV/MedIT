import type { ObjectId } from "mongoose"

export interface IBaseInterface {
  _id?: ObjectId
  createdAt?: Date
  updatedAt?: Date
}
