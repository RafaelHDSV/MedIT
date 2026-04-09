import type { Types } from 'mongoose'
import type { IBaseInterface } from './IBaseInterface'

export const MedicationAvailabilityStatus = {
  AVAILABLE: 'available',
  LOW_STOCK: 'low stock',
  UNAVAILABLE: 'unavailable'
} as const
export type MedicationAvailabilityStatus =
  (typeof MedicationAvailabilityStatus)[keyof typeof MedicationAvailabilityStatus]
export const MedicationAvailabilityStatusLabels = {
  [MedicationAvailabilityStatus.AVAILABLE]: 'Disponível',
  [MedicationAvailabilityStatus.LOW_STOCK]: 'Estoque Baixo',
  [MedicationAvailabilityStatus.UNAVAILABLE]: 'Indisponível'
}

export interface IMedication extends IBaseInterface {
  name: string
  dosage: string
  frequency: string
  route: string
  duration: string
  category: string
  description?: string
  requiresPrescription?: boolean
  availabilityStatus: MedicationAvailabilityStatus
  stockQuantity: number
  unitId: Types.ObjectId
}
