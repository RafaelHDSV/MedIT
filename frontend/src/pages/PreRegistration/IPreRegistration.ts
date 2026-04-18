import type { UserGender } from '@/interfaces/IUser'
import type { Dayjs } from 'dayjs'

export interface PreRegistrationFormValues {
  mainComplaint: string
  painLevel: number
  selfMedicated: boolean
  symptomStartDate: Dayjs | null
  symptoms: string[]
  unitId: string
  birthDate: Dayjs | null
  gender: UserGender
  conditions?: string
  allergies?: string
  generalObservation?: string
}

export interface IPreRegistrationErrors {
  birthDate?: string
  gender?: string
  painLevel?: string
  mainComplaint?: string
  selfMedicated?: string
  symptomStartDate?: string
  conditions?: string
  allergies?: string
  generalObservation?: string
  unitId?: string
}
