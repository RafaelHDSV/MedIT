import { Types } from 'mongoose'
import { IBaseInterface } from './IBaseInterface.js'

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

export const MedicationCategories = {
  ANALGESICS: 'analgesics',
  ANTIBIOTICS: 'antibiotics',
  ANTIVIRALS: 'antivirals',
  ANTIFUNGALS: 'antifungals',
  ANTICONVULSANTS: 'anticonvulsants',
  ANTIDEPRESSANTS: 'antidepressants',
  ANTIPSICOTICOS: 'antipsicoticos',
  ANTISEPTICS: 'antiseptics',
  ANTIVENOMS: 'antivenoms',
  OTHER: 'other'
} as const
export type MedicationCategories =
  (typeof MedicationCategories)[keyof typeof MedicationCategories]
export const MedicationCategoriesLabels = {
  [MedicationCategories.ANALGESICS]: 'Analgésicos',
  [MedicationCategories.ANTIBIOTICS]: 'Antibióticos',
  [MedicationCategories.ANTIVIRALS]: 'Antivirais',
  [MedicationCategories.ANTIFUNGALS]: 'Antifungais',
  [MedicationCategories.ANTICONVULSANTS]: 'Anticonvulsivantes',
  [MedicationCategories.ANTIDEPRESSANTS]: 'Antidepressivos',
  [MedicationCategories.ANTIPSICOTICOS]: 'Antipsicóticos',
  [MedicationCategories.ANTISEPTICS]: 'Anti-sépticos',
  [MedicationCategories.ANTIVENOMS]: 'Antivenenos',
  [MedicationCategories.OTHER]: 'Outro'
}

export interface IMedication extends IBaseInterface {
  name: string
  // VIEIRA: Adicionar novos campos para atribuição de medicamento a pacientes
  // dosage: string
  // frequency: string
  // route: string
  // duration: string
  category: MedicationCategories
  description: string
  requiresPrescription: boolean
  availabilityStatus: MedicationAvailabilityStatus
  stockQuantity: number
  unitId: Types.ObjectId
}
