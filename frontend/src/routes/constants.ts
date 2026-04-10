import { UsersThreeIcon } from '@phosphor-icons/react'

export const ROUTE_GROUP = {
  USERS: { name: 'Usuários', icon: UsersThreeIcon }
}

export const ROUTES = {
  SIGNIN: {
    name: 'Bem-vindo de volta',
    description: 'Acesse sua conta para continuar',
    path: '/'
  },
  SIGNUP: {
    name: 'Crie sua conta',
    description: 'Cadastre-se para começar a usar o sistema',
    path: '/sign-up'
  },
  DASHBOARD: {
    name: 'Dashboard',
    description:
      'Visualize um resumo geral das atividades e indicadores do sistema.',
    path: '/auth/dashboard'
  },
  DOCTORS: {
    name: 'Médicos',
    description: 'Gerencie o cadastro e as informações dos médicos(as).',
    path: '/auth/doctors'
  },
  DOCTORS_DETAILS: {
    name: 'Detalhes do médico',
    description: 'Visualize e gerencie as informações completas do médico(a).',
    path: '/auth/doctors/:id'
  },
  NURSES: {
    name: 'Enfermeiros',
    description: 'Gerencie o cadastro e as informações dos enfermeiros(as).',
    path: '/auth/nurses'
  },
  NURSES_DETAILS: {
    name: 'Detalhes do enfermeiro',
    description:
      'Visualize e gerencie as informações completas do enfermeiro(a).',
    path: '/auth/nurses/:id'
  },
  PATIENTS: {
    name: 'Pacientes',
    description: 'Gerencie o cadastro e os dados dos pacientes.',
    path: '/auth/patients'
  },
  PATIENTS_DETAILS: {
    name: 'Detalhes do paciente',
    description: 'Visualize e gerencie as informações completas do paciente.',
    path: '/auth/patients/:id'
  },
  UNITS: {
    name: 'Unidades',
    description: 'Visualize e gerencie as unidades.',
    path: '/auth/units'
  },
  MEDICAMENTS: {
    name: 'Medicamentos',
    description:
      'Gerencie o cadastro e o controle de medicamentos disponíveis.',
    path: '/auth/units/:unitId/medications'
  },
  PRE_REGISTRATION: {
    name: 'Pré-Cadastro',
    description:
      'Permita que pacientes se pré-cadastrem para agilizar o processo de atendimento.',
    path: '/auth/pre-registration'
  },
  ATTENDANCES: {
    name: 'Histórico de atendimentos',
    description: 'Consulte o histórico de atendimentos realizados no sistema.',
    path: '/auth/attendances'
  },
  TRIAGES: {
    name: 'Histórico de triagens',
    description: 'Consulte o histórico de triagens registradas.',
    path: '/auth/triages'
  },
  TRIAGES_DETAILS: {
    name: 'Detalhes da triagem',
    description: 'Visualize e gerencie as informações completas da triagem.',
    path: '/auth/triages/:id'
  }
}
