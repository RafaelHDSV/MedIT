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
  const canGoToDetails = !userId

  const fetchAttendances = useCallback(async () => {
    setLoading(true)

    try {
      let response
      const userFullId = userId ? userId : user?._id

      switch (userType) {
        case 'doctor':
          response = await DoctorsRepository.getAttendances({
            doctorId: userFullId
          })
          break
        case 'nurse':
          response = await NursesRepository.getAttendances({
            nurseId: userFullId
          })
          break
        case 'patient':
          response = await PatientsRepository.getAttendances({
            patientId: userFullId
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
  }, [user?._id, userId, userType])

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
