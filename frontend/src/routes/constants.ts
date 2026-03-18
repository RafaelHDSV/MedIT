import { UsersThreeIcon } from '@phosphor-icons/react'

export const ROUTE_GROUP = {
  USERS: { name: 'Usuários', icon: UsersThreeIcon }
}

export const ROUTES = {
  SIGNIN: {
    name: 'Login',
    description: 'Acesse sua conta para utilizar o sistema.',
    path: '/'
  },
  SIGNUP: {
    name: 'Cadastro',
    description: 'Crie uma nova conta para acessar a plataforma.',
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
    description: 'Gerencie o cadastro e as informações dos médicos.',
    path: '/auth/doctors'
  },
  DOCTORS_DETAILS: {
    name: 'Detalhes do médico',
    description: 'Visualize e gerencie as informações completas do médico.',
    path: '/auth/doctors/:id'
  },
  NURSES: {
    name: 'Enfermeiros',
    description: 'Gerencie o cadastro e as informações dos enfermeiros.',
    path: '/auth/nurses'
  },
  NURSES_DETAILS: {
    name: 'Detalhes do enfermeiro',
    description: 'Visualize e gerencie as informações completas do enfermeiro.',
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
  MEDICAMENTS: {
    name: 'Medicamentos',
    description:
      'Gerencie o cadastro e o controle de medicamentos disponíveis.',
    path: '/auth/medications'
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
  }
}
