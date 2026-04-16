import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import RiskTag from '@/components/RiskTag/RiskTag'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { handleApiError } from '@/helpers/handleApiError'
import { type IAttendance } from '@/interfaces/IAttendance'
import { DoctorSpecializationsLabels, type IDoctor } from '@/interfaces/IDoctor'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import UserRepository from '@/repositories/UserRepository'
import capitalize from '@/utils/capitalize'
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
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
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
              value: dayjs(doctor?.birthDate).format('DD/MM/YYYY')
            },
            {
              label: 'Especialidade',
              value:
                doctor?.specialization &&
                DoctorSpecializationsLabels[doctor.specialization]
                  ? DoctorSpecializationsLabels[doctor.specialization]
                  : capitalize(doctor?.specialization)
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
              value: attendances?.[0].complaint
            },
            // VIEIRA: Adicionar assertividade IA
            { label: 'Sugestão IA', value: '0' },
            {
              label: 'Definição Médica',
              // VIEIRA: Precisa adicionar o ✅ quando for o caso
              value: attendances?.[0].diagnosis
            },
            {
              label: 'Risco',
              value: <RiskTag risk={attendances?.[0].risk} />
            },
            {
              label: 'Data',
              value: dayjs(attendances?.[0].date).format('DD/MM/YYYY')
            }
          ]}
          loading={loading}
        />
        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          itens={attendances?.map((attendance) => ({
            key: attendance._id,
            label: dayjs(attendance.date).format('DD/MM/YYYY'),
            value: attendance.complaint
          }))}
          loading={loading}
          doctorId={String(doctor?._id)}
          isAttendanceHistory
        />
      </div>
    </section>
  )
}

export default DoctorDetails
