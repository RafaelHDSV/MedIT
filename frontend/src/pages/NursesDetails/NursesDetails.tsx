import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import type { IError } from '@/interfaces/IError'
import { NurseShiftsLabels, type INurse } from '@/interfaces/INurse'
import UserRepository from '@/repositories/UserRepository'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { Flex, message } from 'antd'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NurseModal from '../Nurses/components/NurseModal/NurseModal'
import styles from './NursesDetails.module.scss'

// VIEIRA: Remover mock
const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  Temperature: '37.8°C',
  Pressure: '130/85 mmHg',
  SuggestionAI: 'Dengue (87%)',
  date: '12/01/2025'
}

// VIEIRA: Corrigir tipagem any
// VIEIRA: Remover mock
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

function NursesDetails() {
  const params = useParams<{ id: string }>()
  const [nurse, setNurse] = useState<INurse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchNurseDetails = useCallback(async () => {
    setLoading(true)

    try {
      const response = await UserRepository.getDetails({ userId: params.id })
      setNurse(response)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(
        error.response?.data?.message ||
          'Erro ao carregar detalhes do enfermeiro(a)'
      )
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchNurseDetails()
  }, [fetchNurseDetails])

  return (
    <section>
      <AuthLayoutHeader
        actionComponent={
          <Flex gap='1rem'>
            <NurseModal
              nurse={nurse}
              buttonText='Editar enfermeiro(a)'
              fetchNurseDetails={fetchNurseDetails}
            />

            <DeleteModal
              label='enfermeiro(a)'
              apiName='nurses'
              buttonText='Deletar enfermeiro(a)'
            />
          </Flex>
        }
      />

      <UserDetailsHeader
        name={nurse?.name}
        age={getAgeByBirthDate(nurse?.birthDate)}
        gender={nurse?.gender}
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
        loading={loading}
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: masks(nurse?.cpf, 'cpf') },
            { label: 'COREN', value: nurse?.coren },
            {
              label: 'Turno',
              value: nurse?.shift && NurseShiftsLabels[nurse.shift]
            },
            {
              label: 'Telefone',
              value: masks(nurse?.cellphone, 'cellphone')
            },
            {
              label: 'Data de Nascimento',
              value: dayjs(nurse?.birthDate).format('DD/MM/YYYY')
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
            label: dayjs(item.date).format('DD/MM/YYYY'),
            value: `${item.diagnosis ?? ''} - ${item.complaint}`
          }))}
        />
      </div>
    </section>
  )
}
export default NursesDetails
