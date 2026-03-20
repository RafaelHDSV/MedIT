import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import type { IAttendance } from '@/interfaces/IAttendance'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'

import styles from './PatientsDetails.module.scss'
import { UserGender } from '@/interfaces/IUser'

const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  Temperature: '37.8°C',
  Pressure: '130/85 mmHg',
  SuggestionAI: 'Dengue (87%)',
  date: '12/01/2025'
}
//Alteração incorreta das datas, corrigir depois
const mockedAttendanceRecords: IAttendance[] = [
  { type: 'Consulta', description: 'Gripe', date: new Date('2025-12-01') },
  { type: 'Emergência', description: 'Entorse', date: new Date('2024-08-11') },
  { type: 'Rotina', description: 'Check-up', date: new Date('2024-06-15') },
  { type: 'Consulta', description: 'Alergia', date: new Date('2024-03-22') }
]
function PatientsDetails() {
  return (
    <section>
      <AuthLayoutHeader />
      <UserDetailsHeader
        name={'Renata Aragão'}
        age={37}
        gender={UserGender.FEMALE}
        statusTag={TagStatuses.INFO}
        statusTagText='Internado'
      />

      <div className={styles.cards}>
        <UserDetailsCard
          useFullWidth={true}
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: '123.456.789-00' },
            { label: 'Nome', value: 'Maria Santos' },
            {
              label: 'E-mail',
              value: 'mariasantos@gmail.com'
            },
            {
              label: 'Telefone',
              value: '(15) 99999-1234'
            },
            {
              label: 'Tipo Sanguíneo',
              value: 'O+'
            },
            {
              label: 'Data de Nascimento',
              value: '15/10/1986'
            },
            {
              label: 'Peso',
              value: '72 kg'
            },
            {
              label: 'Altura',
              value: '1.63'
            },
            {
              label: 'Condições',
              value: 'Hipertensão'
            },
            {
              label: 'Alergias',
              value: 'Dipirona, Latéx'
            }
          
          ]}
        />
        <UserDetailsCard
          Icon={CalendarDotsIcon}
          title='Último Atendimento'
          itens={[
            {
              label: 'Principal Queixa',
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
export default PatientsDetails
