import type { IBaseUser, UserLevels } from './IUser'

export interface IDoctor extends IBaseUser {
  crm: string
  specialization: string
}

export interface DoctorFormValues {
  name: string
  cpf: string
  birthDate: Date
  gender: UserLevels
  email: string
  password: string
  cellphone: string
  crm: string
  specialization: string
}
