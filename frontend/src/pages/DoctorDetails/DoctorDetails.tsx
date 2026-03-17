import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import type { IAttendance } from '@/interfaces/IAttendance'
import type { IError } from '@/interfaces/IError'
import { type IUser } from '@/interfaces/IUser'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './DoctorDetails.module.scss'

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
  const params = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDoctorDetails() {
      setLoading(true)

      try {
        const response = await api.get(`/users/${params.id}`)
        const data = response.data
        setDoctor(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao carregar detalhes do médico'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetails()
  }, [params.id])

  return (
    <section>
      <AuthLayoutHeader />
      <UserDetailsHeader
        name={doctor?.name}
        age={doctor?.age}
        gender={doctor?.gender}
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
        loading={loading}
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: masks(doctor?.cpf, 'cpf') },
            {
              label: 'Telefone',
              value: masks(doctor?.cellphone, 'cellphone')
            },
            {
              label: 'Data de Nascimento',
              value: dayjs(doctor?.birthDate).format('DD/MM/YYYY')
            },
            {
              label: 'Especialidade',
              value: doctor?.specialization
            },
            { label: 'CRM', value: doctor?.crm }
          ]}
          loading={loading}
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
          loading={loading}
        />
        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          itens={mockedAttendanceRecords.map((item) => ({
            label: item.date.toLocaleDateString(),
            value: `${item.type} - ${item.description}`
          }))}
          loading={loading}
        />
      </div>
    </section>
  )
}

export default DoctorDetails
