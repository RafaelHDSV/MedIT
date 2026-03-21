import type { IBaseInterface } from './IBaseInterface'

export const TriagesRisk = {
  EMERGENCY: 'emergency',
  VERY_URGENT: 'veryUrgent',
  URGENT: 'urgent',
  LESS_URGENT: 'lessUrgent',
  NOT_URGENT: 'notUrgent'
} as const
export type TriagesRisk = (typeof TriagesRisk)[keyof typeof TriagesRisk]
export const TriagesRiskLabels = {
  [TriagesRisk.EMERGENCY]: 'Emergência',
  [TriagesRisk.VERY_URGENT]: 'Muito urgente',
  [TriagesRisk.URGENT]: 'Urgente',
  [TriagesRisk.LESS_URGENT]: 'Pouco urgente',
  [TriagesRisk.NOT_URGENT]: 'Não urgente'
} as const

export interface ITriages extends IBaseInterface {
  name: string
  birthDate: Date
  complaint: string
  date: Date
  risk: TriagesRisk
}
