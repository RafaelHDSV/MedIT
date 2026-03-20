import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import type { IAttendance } from '@/interfaces/IAttendance'
import { UserGender } from '@/interfaces/IUser'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import styles from './NursesDetails.module.scss'

const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  Temperature: '37.8°C',
  Pressure: '130/85 mmHg',
  SuggestionAI: 'Dengue (87%)',
  date: '12/01/2025'
}

const mockedAttendanceRecords: IAttendance[] = [
  { type: 'Consulta', description: 'Gripe', date: new Date('2025-12-01') },
  { type: 'Emergência', description: 'Entorse', date: new Date('2024-08-11') },
  { type: 'Rotina', description: 'Check-up', date: new Date('2024-06-15') },
  { type: 'Consulta', description: 'Alergia', date: new Date('2024-03-22') }
]
function NursesDetails() {
  return (
    <section>
      <AuthLayoutHeader />
      <UserDetailsHeader
        name={'Renata Aragão'}
        age={37}
        gender={UserGender.FEMALE}
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: '5508.360.050-15' },
            { label: 'COREN', value: '123.456-ENF' },
            {
              label: 'Turno',
              value: 'Noturno'
            },
            {
              label: 'Telefone',
              value: '(15) 99642-7257'
            },
            {
              label: 'Data de Nascimento',
              value: '05/03/1989'
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
            { label: 'Temperatura', value: mockedLastAttendance.Temperature },
            {
              label: 'Pressão',
              value: mockedLastAttendance.Pressure
            },
            {
              label: 'Sugestão IA',
              value: mockedLastAttendance.SuggestionAI
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
    </section>
  )
}
export default NursesDetails
