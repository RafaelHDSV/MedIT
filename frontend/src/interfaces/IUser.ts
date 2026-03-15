export const Roles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT'
} as const
export type Roles = (typeof Roles)[keyof typeof Roles]

export const UserRoles = {
  ADMIN: 'Administrador(a)',
  DOCTOR: 'Médico(a)',
  NURSE: 'Enfermeiro(a)',
  PATIENT: 'Paciente'
} as const

export interface IUser {
  _id: string
  name: string
  role: Roles
  email: string
  password: string
}
