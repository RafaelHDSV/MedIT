import type { ObjectId as MongooseObjectId } from 'mongoose'

export const ObjectId = (id: string) => id as unknown as MongooseObjectId
