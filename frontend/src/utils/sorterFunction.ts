import type { ObjectId } from 'mongoose'

export function sorterFunction<K extends { _id?: ObjectId }>(a: K, b: K) {
  const idA = a._id ? a._id.toString() : ''
  const idB = b._id ? b._id.toString() : ''
  return idA.localeCompare(idB)
}
