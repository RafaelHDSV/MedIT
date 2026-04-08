export const MaterialAvailabilityStatus = {
  AVAILABLE: 'Disponível',
  LOW_STOCK: 'Estoque Baixo',
  UNAVAILABLE: 'Indisponível'
} as const

export type MaterialAvailabilityStatus = typeof MaterialAvailabilityStatus[keyof typeof MaterialAvailabilityStatus]

export interface IMedication {
  _id: string
  name: string
  category: string
  description?: string
  requiresPrescription?: boolean
  availabilityStatus: MaterialAvailabilityStatus
  stockQuantity: number
  unitId: string
}
