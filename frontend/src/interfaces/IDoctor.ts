import type { Dayjs } from 'dayjs'
import type { IBaseUser, UserGender } from './IUser'

export const DoctorSpecializations = {
  CARDIOLOGY: 'cardiology',
  DERMATOLOGY: 'dermatology',
  NEUROLOGY: 'neurology',
  PEDIATRICS: 'pediatrics',
  PSYCHIATRY: 'psychiatry',
  ORTHOPEDICS: 'orthopedics',
  GYNECOLOGY: 'gynecology',
  OPHTHALMOLOGY: 'ophthalmology',
  OTOLARYNGOLOGY: 'otolaryngology',
  RADIOLOGY: 'radiology',
  ANESTHESIOLOGY: 'anesthesiology',
  EMERGENCY_MEDICINE: 'emergency_medicine',
  ENDOCRINOLOGY: 'endocrinology',
  GASTROENTEROLOGY: 'gastroenterology',
  HEMATOLOGY: 'hematology',
  INFECTIOUS_DISEASES: 'infectious_diseases',
  NEPHROLOGY: 'nephrology',
  PULMONOLOGY: 'pulmonology',
  RHEUMATOLOGY: 'rheumatology',
  UROLOGY: 'urology',
  OTHER: 'other'
} as const
export type DoctorSpecializations =
  (typeof DoctorSpecializations)[keyof typeof DoctorSpecializations]
export const DoctorSpecializationsLabels = {
  [DoctorSpecializations.CARDIOLOGY]: 'Cardiologia',
  [DoctorSpecializations.DERMATOLOGY]: 'Dermatologia',
  [DoctorSpecializations.NEUROLOGY]: 'Neurologia',
  [DoctorSpecializations.PEDIATRICS]: 'Pediatria',
  [DoctorSpecializations.PSYCHIATRY]: 'Psiquiatria',
  [DoctorSpecializations.ORTHOPEDICS]: 'Ortopedia',
  [DoctorSpecializations.GYNECOLOGY]: 'Ginecologia',
  [DoctorSpecializations.OPHTHALMOLOGY]: 'Oftalmologia',
  [DoctorSpecializations.OTOLARYNGOLOGY]: 'Otorrinolaringologia',
  [DoctorSpecializations.RADIOLOGY]: 'Radiologia',
  [DoctorSpecializations.ANESTHESIOLOGY]: 'Anestesiologia',
  [DoctorSpecializations.EMERGENCY_MEDICINE]: 'Medicina de Emergência',
  [DoctorSpecializations.ENDOCRINOLOGY]: 'Endocrinologia',
  [DoctorSpecializations.GASTROENTEROLOGY]: 'Gastroenterologia',
  [DoctorSpecializations.HEMATOLOGY]: 'Hematologia',
  [DoctorSpecializations.INFECTIOUS_DISEASES]: 'Doenças Infecciosas',
  [DoctorSpecializations.NEPHROLOGY]: 'Nefrologia',
  [DoctorSpecializations.PULMONOLOGY]: 'Pneumologia',
  [DoctorSpecializations.RHEUMATOLOGY]: 'Reumatologia',
  [DoctorSpecializations.UROLOGY]: 'Urologia',
  [DoctorSpecializations.OTHER]: 'Outro'
} as const

export interface IDoctor extends IBaseUser {
  crm: string
  specialization: DoctorSpecializations
}

export interface DoctorFormValues {
  name: string
  cpf: string
  birthDate: Dayjs | null
  gender: UserGender
  email: string
  currentPassword?: string
  newPassword?: string
  password?: string
  cellphone: string
  crm: string
  specialization: DoctorSpecializations
}

export interface IDoctorFormErrors {
  name?: string
  cpf?: string
  birthDate?: string
  gender?: string
  email?: string
  currentPassword?: string
  newPassword?: string
  password?: string
  cellphone?: string
  crm?: string
  specialization?: string
  otherSpecialization?: string
}