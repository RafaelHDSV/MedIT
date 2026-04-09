import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { handleApiError } from '@/helpers/handleApiError'
import type { IAttendance } from '@/interfaces/IAttendance'
import type { IPatient } from '@/interfaces/IPatient'
import PatientsRepository from '@/repositories/PatientsRepository'
import UserRepository from '@/repositories/UserRepository'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PatientModal from '../Patients/components/PatientModal/PatientModal'
import styles from './PatientsDetails.module.scss'

function PatientsDetails() {
  const params = useParams<{ id: string }>()
  const [patient, setPatient] = useState<IPatient | null>(null)
  const [attendances, setAttendances] = useState<IAttendance[]>()
  const [detailsLoading, setDetailsLoading] = useState(true)
  const [attendancesLoading, setAttendancesLoading] = useState(true)
  const loading = detailsLoading || attendancesLoading

  const fetchPatientDetails = useCallback(async () => {
    setDetailsLoading(true)

    try {
      const response = await UserRepository.getDetails({ userId: params.id })
      setPatient(response)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar detalhes do paciente'
      })
    } finally {
      setDetailsLoading(false)
    }
  }, [params.id])

  const fetchPatientsAttendances = useCallback(async () => {
    setAttendancesLoading(true)

    try {
      const response = await PatientsRepository.getAttendances({
        patientId: params.id
      })
      setAttendances(response)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar os atendimentos do enfermeiro(a)'
      })
    } finally {
      setAttendancesLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchPatientDetails()
    fetchPatientsAttendances()
  }, [fetchPatientDetails, fetchPatientsAttendances])

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
              user={patient}
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
              value: attendances?.[0].complaint
            },
            {
              label: 'Temperatura',
              value: `${attendances?.[0].vitalSigns?.temperature} °C`
            },
            {
              label: 'Pressão',
              value: `${attendances?.[0].vitalSigns?.bloodPressure} mmHg`
            },
            // VIEIRA: Adicionar assertividade IA
            {
              label: 'Sugestão IA',
              value: '0'
            },
            {
              label: 'Data',
              value: dayjs(attendances?.[0].date).format('DD/MM/YYYY')
            }
          ]}
        />

        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          className={styles.attendanceHistoryCard}
          // VIEIRA Tirar slice e quando clicar mostrar todos
          itens={attendances?.slice(0, 5)?.map((attendance) => ({
            key: attendance._id,
            label: dayjs(attendance.date).format('DD/MM/YYYY'),
            value: attendance.complaint
          }))}
        />
      </div>
    </section>
  )
}

export default PatientsDetails
