import { UsersThreeIcon } from '@phosphor-icons/react'

export const ROUTE_GROUP = {
  USERS: { name: 'Usuários', icon: UsersThreeIcon }
}

export const ROUTES = {
  SIGNIN: { name: 'Login', path: '/' },
  SIGNUP: { name: 'Cadastro', path: '/sign-up' },
  DASHBOARD: { name: 'Dashboard', path: '/auth/dashboard' },
  DOCTORS: { name: 'Médicos', path: '/auth/doctors' },
  NURSE: { name: 'Enfermeiros', path: '/auth/nurses' },
  PATIENTS: { name: 'Pacientes', path: '/auth/patients' },
  MEDICAMENTS: { name: 'Medicamentos', path: '/auth/medications' }
}
