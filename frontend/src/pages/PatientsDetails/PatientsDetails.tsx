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
import dayjs from 'dayjs'
import styles from './PatientsDetails.module.scss'

const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  Temperature: '37.8°C',
  Pressure: '130/85 mmHg',
  SuggestionAI: 'Dengue (87%)',
  date: '12/01/2025'
}

const mockedAttendanceRecords: IAttendance[] = [
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Gripe',
    diagnosis: 'Consulta',
    date: new Date('2025-12-01'),
    risk: 'notUrgent'
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Entorse',
    diagnosis: 'Emergência',
    date: new Date('2024-08-11'),
    risk: 'emergency'
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Check-up',
    diagnosis: 'Rotina',
    date: new Date('2024-06-15'),
    risk: 'lessUrgent'
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Alergia',
    diagnosis: 'Consulta',
    date: new Date('2024-03-22'),
    risk: 'urgent'
  }
]
function PatientsDetails() {
  return (
    <section className={styles.container}>
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
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          className={styles.initialDataCard}
          useFullWidth={true}
          itens={[
            { label: 'CPF', value: '123.456.789-00' },
            {
              label: 'Data de Nascimento',
              value: '15/10/1986'
            },
            { label: 'Nome', value: 'Maria Santos' },
            {
              label: 'Peso',
              value: '72 kg'
            },
            {
              label: 'E-mail',
              value: 'mariasantos@gmail.com'
            },
            {
              label: 'Altura',
              value: '1.63'
            },
            {
              label: 'Telefone',
              value: '(15) 99999-1234'
            },
            {
              label: 'Condições',
              value: 'Hipertensão'
            },
            {
              label: 'Tipo Sanguíneo',
              value: 'O+'
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
          className={styles.lastAttendanceCard}
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
          className={styles.attendanceHistoryCard}
          itens={mockedAttendanceRecords.map((item) => ({
            label: dayjs(item.date).format('DD/MM/YYYY'),
            value: `${item.diagnosis ?? ''} - ${item.complaint}`
          }))}
        />
      </div>
    </section>
  )
}
export default PatientsDetails
