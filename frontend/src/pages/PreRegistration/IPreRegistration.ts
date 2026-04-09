import type { UserGender } from '@/interfaces/IUser'
import type { Dayjs } from 'dayjs'

export interface PreRegistrationFormValues {
  birthDate: Dayjs | null
  gender: UserGender
  painLevel: number
  mainComplaint: string
  selfMedicated: boolean
  symptomStartDate: Dayjs | null
  conditions?: string[]
  allergies?: string[]
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
}
