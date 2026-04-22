import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { type IAttendance } from '@/interfaces/IAttendance'
import type { LevelsTypes } from '@/interfaces/IUser'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import NursesRepository from '@/repositories/NursesRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import { useAttendancesColumns } from './hooks/useAttendancesColumns'

interface IAttendancesProps {
  userId?: string
  userType?: LevelsTypes
}

function Attendances({ userId, userType }: IAttendancesProps) {
  const { user } = useAuth()
  const [attendances, setAttendances] = useState<IAttendance[]>([])
  const [loading, setLoading] = useState(true)

  const finalUserId = userId ? userId : user?._id
  const finalUserType = userType ? userType : user?.level
  const canGoToDetails = !userId

  const fetchAttendances = useCallback(async () => {
    setLoading(true)

    try {
      let response

      switch (finalUserType) {
        case 'doctor':
          response = await DoctorsRepository.getAttendances({
            doctorId: finalUserId
          })
          break
        case 'nurse':
          response = await NursesRepository.getAttendances({
            nurseId: finalUserId
          })
          break
        case 'patient':
          response = await PatientsRepository.getAttendances({
            patientId: finalUserId
          })
          break
        default:
          break
      }

      setAttendances(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de atendimentos'
      })
    } finally {
      setLoading(false)
    }
  }, [finalUserId, finalUserType])

  useEffect(() => {
    fetchAttendances()
  }, [fetchAttendances])

  const columns = useAttendancesColumns({ canGoToDetails })

  return (
    <div className={styles.tableContent}>
      <Flex vertical className={styles.container}>
        {!userId && <AuthLayoutHeader />}

        <ListTable<IAttendance>
          dataSource={attendances}
          columns={columns}
          loading={loading}
          onReload={fetchAttendances}
        />
      </Flex>
    </div>
  )
}

export default Attendances
