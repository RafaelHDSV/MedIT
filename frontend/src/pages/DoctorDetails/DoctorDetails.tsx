import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { handleApiError } from '@/helpers/handleApiError'
import { type IAttendance } from '@/interfaces/IAttendance'
import { DoctorSpecializationsLabels, type IDoctor } from '@/interfaces/IDoctor'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import UserRepository from '@/repositories/UserRepository'
import capitalize from '@/utils/capitalize'
import { formatDate } from '@/utils/formatDate'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DoctorModal from '../Doctors/components/DoctorModal/DoctorModal'
import styles from './DoctorDetails.module.scss'

function DoctorDetails() {
  const params = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<IDoctor | null>(null)
  const [attendances, setAttendances] = useState<IAttendance[]>()
  const [detailsLoading, setDetailsLoading] = useState(true)
  const [attendancesLoading, setAttendancesLoading] = useState(true)
  const loading = detailsLoading || attendancesLoading

  const fetchDoctorDetails = useCallback(async () => {
    setDetailsLoading(true)

    try {
      const response = await UserRepository.getDetails({ userId: params.id })
      setDoctor(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar detalhes do médico(a)'
      })
    } finally {
      setDetailsLoading(false)
    }
  }, [params.id])

  const fetchDoctorsAttendances = useCallback(async () => {
    setAttendancesLoading(true)

    try {
      const response = await DoctorsRepository.getAttendances({
        doctorId: params.id
      })
      setAttendances(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar os atendimentos do médico'
      })
    } finally {
      setAttendancesLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchDoctorDetails()
    fetchDoctorsAttendances()
  }, [fetchDoctorDetails, fetchDoctorsAttendances])

  const lastAttendance = attendances?.[0]
  const lastAttendanceItems = lastAttendance
    ? [
        {
          label: 'Queixa do Paciente',
          value: lastAttendance.complaint ?? '-'
        },
        {
          label: 'Sugestão IA',
          value: lastAttendance.iaTopSuggestion ?? 'n/a',
          checked: lastAttendance.isIaTopSuggestionMatchDiagnosis
        },
        {
          label: 'Definição Médica',
          value: lastAttendance.diagnosis
            ? `${lastAttendance.diagnosis}`
            : undefined
        },
        {
          label: 'Risco',
          value: <RiskTag risk={lastAttendance.risk} />
        },
        {
          label: 'Data',
          value: lastAttendance.date
            ? formatDate({ date: lastAttendance.date, mode: 'date' })
            : '-'
        }
      ]
    : [{ label: 'Sem atendimentos registrados', value: '-' }]

  const historyItems =
    attendances && attendances?.length > 0
      ? attendances?.map((attendance) => ({
          key: attendance._id,
          label: formatDate({ date: attendance.date, mode: 'date' }),
          value: attendance.complaint
        }))
      : [{ label: 'Sem atendimentos registrados', value: '-' }]

  return (
    <section>
      <AuthLayoutHeader
        actionComponent={
          <Flex gap='1rem'>
            <DoctorModal
              doctor={doctor}
              buttonText='Editar médico(a)'
              fetchDoctorDetails={fetchDoctorDetails}
            />

            <DeleteModal
              user={doctor}
              label='médico(a)'
              apiName='doctors'
              buttonText='Deletar médico(a)'
            />
          </Flex>
        }
      />

      <UserDetailsHeader
        name={doctor?.name}
        age={getAgeByBirthDate(doctor?.birthDate)}
        gender={doctor?.gender}
        loading={loading}
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            {
              label: 'CPF',
              value: masks(doctor?.cpf, 'cpf')
            },
            {
              label: 'Telefone',
              value: masks(doctor?.cellphone, 'cellphone')
            },
            {
              label: 'Data de Nascimento',
              value: formatDate({
                date: doctor?.birthDate,
                mode: 'date'
              })
            },
            {
              label: 'Especialidade',
              value:
                doctor?.specialization &&
                DoctorSpecializationsLabels[doctor.specialization]
                  ? DoctorSpecializationsLabels[doctor.specialization]
                  : capitalize(doctor?.specialization)
            },
            { label: 'CRM', value: doctor?.crm },
            {
              label: 'Sala / consultório (paciente)',
              value: doctor?.workLocationLabel
            }
          ]}
          loading={loading}
        />
        <UserDetailsCard
          Icon={CalendarDotsIcon}
          title='Último Atendimento'
          itens={lastAttendanceItems}
          loading={loading}
        />
        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          itens={historyItems}
          loading={loading}
          userId={String(doctor?._id)}
          userType='doctor'
          isAttendanceHistory
        />
      </div>
    </section>
  )
}

export default DoctorDetails
