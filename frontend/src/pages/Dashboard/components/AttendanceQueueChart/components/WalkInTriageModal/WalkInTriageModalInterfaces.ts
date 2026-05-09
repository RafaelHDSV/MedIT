import type { UserGender } from '@/interfaces/IUser'
import { type Dayjs } from 'dayjs'

export interface WalkInTriageFormValues {
  patientName: string
  patientCpf: string
  patientEmail: string
  patientPassword?: string
  mainComplaint: string
  painLevel: number
  selfMedicated: boolean
  symptomStartDate: Dayjs | null
  birthDate?: Dayjs | null
  gender?: UserGender
  conditions?: string
  allergies?: string
  generalObservation?: string
}
