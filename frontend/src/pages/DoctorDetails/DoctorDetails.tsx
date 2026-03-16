import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import type { IAttendance } from '@/interfaces/IAttendance'
import { UserGender, UserRoles, type IUser } from '@/interfaces/IUser'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import styles from './DoctorDetails.module.scss'

const mockedDoctor: IUser = {
  name: 'Fernando Luís',
  cpf: '32818911010',
  role: UserRoles.DOCTOR,
  email: 'fernando.luis@example.com',
  password: 'password123',
  age: 58,
  gender: UserGender.MALE,
  cellphone: 15999991234,
  birthDate: new Date('1968-09-15'),
  crm: '117101',
  specialization: 'Pediatria'
}

const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  suggestion: 'Dengue (87%)',
  medicalDefinition: 'Dengue ✅',
  attendanceTime: '20 min',
  date: '12/01/2025'
}

const mockedAttendanceRecords: IAttendance[] = [
  { type: 'Consulta', description: 'Gripe', date: new Date('2025-12-01') },
  { type: 'Emergência', description: 'Entorse', date: new Date('2024-08-11') },
  { type: 'Rotina', description: 'Check-up', date: new Date('2024-06-15') },
  { type: 'Consulta', description: 'Alergia', date: new Date('2024-03-22') }
]

function DoctorDetails() {
  return (
    <div className={styles.container}>
      <AuthLayoutHeader />
      <UserDetailsHeader
        name={mockedDoctor.name}
        age={mockedDoctor.age || 0}
        gender={mockedDoctor.gender}
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: masks(mockedDoctor.cpf, 'cpf') },
            { label: 'CRM', value: mockedDoctor.crm },
            {
              label: 'Especialidade',
              value: mockedDoctor.specialization
            },
            {
              label: 'Telefone',
              value: masks(mockedDoctor.cellphone, 'cellphone')
            },
            {
              label: 'Data de Nascimento',
              value: mockedDoctor.birthDate?.toLocaleDateString()
            }
          ]}
        />
        <UserDetailsCard
          Icon={CalendarDotsIcon}
          title='Último Atendimento'
          itens={[
            {
              label: 'Queixa do Paciente',
              value: mockedLastAttendance.patientComplaint
            },
            { label: 'Sugestão IA', value: mockedLastAttendance.suggestion },
            {
              label: 'Definição Médica',
              value: mockedLastAttendance.medicalDefinition
            },
            {
              label: 'Tempo de Atendimento',
              value: mockedLastAttendance.attendanceTime
            },
            { label: 'Data', value: mockedLastAttendance.date }
          ]}
        />
        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          itens={mockedAttendanceRecords.map((item) => ({
            label: item.date.toLocaleDateString(),
            value: `${item.type} - ${item.description}`
          }))}
        />
      </div>
    </div>
  )
}

export default DoctorDetails
