import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { handleApiError } from '@/helpers/handleApiError'
import { type IAttendance } from '@/interfaces/IAttendance'
import { NurseShiftsLabels, type INurse } from '@/interfaces/INurse'
import NursesRepository from '@/repositories/NursesRepository'
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
import NurseModal from '../Nurses/components/NurseModal/NurseModal'
import styles from './NursesDetails.module.scss'

function NursesDetails() {
  const params = useParams<{ id: string }>()
  const [nurse, setNurse] = useState<INurse | null>(null)
  const [attendances, setAttendances] = useState<IAttendance[]>()
  const [detailsLoading, setDetailsLoading] = useState(true)
  const [attendancesLoading, setAttendancesLoading] = useState(true)
  const loading = detailsLoading || attendancesLoading

  const fetchNurseDetails = useCallback(async () => {
    setDetailsLoading(true)

    try {
      const response = await UserRepository.getDetails({ userId: params.id })
      setNurse(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar detalhes do enfermeiro(a)'
      })
    } finally {
      setDetailsLoading(false)
    }
  }, [params.id])

  const fetchNursesAttendances = useCallback(async () => {
    setAttendancesLoading(true)

    try {
      const response = await NursesRepository.getAttendances({
        nurseId: params.id
      })
      setAttendances(response.data)
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
    fetchNurseDetails()
    fetchNursesAttendances()
  }, [fetchNurseDetails, fetchNursesAttendances])

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
              user={nurse}
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
          loading={loading}
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
          loading={loading}
          itens={[
            {
              label: 'Queixa do Paciente',
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
            {
              label: 'Sugestão IA',
              value: attendances?.[0]?.iaTopSuggestion
                ? attendances?.[0].iaTopSuggestion
                : 'n/a',
              checked: attendances?.[0].isIaTopSuggestionMatchDiagnosis
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
          itens={attendances?.map((attendance) => ({
            key: attendance._id,
            label: dayjs(attendance.date).format('DD/MM/YYYY'),
            value: attendance.complaint
          }))}
          loading={loading}
          userId={String(nurse?._id)}
          userType='nurse'
          isAttendanceHistory
        />
      </div>
    </section>
  )
}
export default NursesDetails
