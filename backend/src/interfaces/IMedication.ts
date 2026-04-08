import mongoose, { Document } from 'mongoose'

export enum MaterialAvailabilityStatus {
  AVAILABLE = 'Disponível',
  LOW_STOCK = 'Estoque Baixo',
  UNAVAILABLE = 'Indisponível'
}

export interface IMedication extends Document {
  name: string
  category: string
  description?: string
  requiresPrescription?: boolean
  availabilityStatus: MaterialAvailabilityStatus
  stockQuantity: number
  unitId: mongoose.Types.ObjectId
}
