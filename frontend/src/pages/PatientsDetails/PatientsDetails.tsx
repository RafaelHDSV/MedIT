import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import type { IError } from '@/interfaces/IError'
import type { IPatient } from '@/interfaces/IPatient'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { Flex, message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PatientModal from '../Patients/components/PatientModal/PatientModal'
import styles from './PatientsDetails.module.scss'

const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  Temperature: '37.8°C',
  Pressure: '130/85 mmHg',
  SuggestionAI: 'Dengue (87%)',
  date: '12/01/2025'
}

// VIEIRA: Corrigir tipagem any
const mockedAttendanceRecords: any[] = [
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Gripe',
    diagnosis: 'Consulta',
    date: new Date('2025-12-01'),
    risk: AttendanceRisk.NOT_URGENT
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Entorse',
    diagnosis: 'Emergência',
    date: new Date('2024-08-11'),
    risk: AttendanceRisk.EMERGENCY
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Check-up',
    diagnosis: 'Rotina',
    date: new Date('2024-06-15'),
    risk: AttendanceRisk.LESS_URGENT
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Alergia',
    diagnosis: 'Consulta',
    date: new Date('2024-03-22'),
    risk: AttendanceRisk.URGENT
  }
]

function PatientsDetails() {
  const params = useParams<{ id: string }>()
  const [patient, setPatient] = useState<IPatient | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPatientDetails = useCallback(async () => {
    setLoading(true)

    try {
      const response = await api.get(`/users/${params.id}`)
      const data = response.data
      setPatient(data)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(
        error.response?.data?.message || 'Erro ao carregar detalhes do paciente'
      )
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchPatientDetails()
  }, [fetchPatientDetails])

  return (
    <section className={styles.container}>
      <AuthLayoutHeader
        actionComponent={
          <Flex gap='1rem'>
            <PatientModal
              patient={patient}
              buttonText='Editar paciente'
              fetchPatientDetails={fetchPatientDetails}
            />

            <DeleteModal
              label='paciente'
              apiName='patients'
              buttonText='Deletar paciente'
            />
          </Flex>
        }
      />
      <UserDetailsHeader
        name={patient?.name}
        age={getAgeByBirthDate(patient?.birthDate)}
        gender={patient?.gender}
        statusTag={TagStatuses.INFO}
        statusTagText='Internado'
        loading={loading}
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          className={styles.initialDataCard}
          useFullWidth={true}
          itens={[
            { label: 'CPF', value: masks(patient?.cpf, 'cpf') },
            {
              label: 'Data de Nascimento',
              value: dayjs(patient?.birthDate).format('DD/MM/YYYY')
            },
            { label: 'Nome', value: patient?.name },
            {
              label: 'Peso',
              value: patient?.weight?.toString()
            },
            {
              label: 'E-mail',
              value: patient?.email
            },
            {
              label: 'Altura',
              value: patient?.height?.toString()
            },
            {
              label: 'Telefone',
              value: masks(patient?.cellphone, 'cellphone')
            },
            {
              label: 'Condições',
              value: patient?.conditions?.join(', ')
            },
            {
              label: 'Tipo Sanguíneo',
              value: patient?.bloodType
            },
            {
              label: 'Alergias',
              value: patient?.allergies?.join(', ')
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
