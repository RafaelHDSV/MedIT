import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { useAuth } from '@/hooks/useAuth'
import { type IAttendance } from '@/interfaces/IAttendance'
import type { IError } from '@/interfaces/IError'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import { Flex, message } from 'antd'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import { useAttendancesColumns } from './hooks/useAttendancesColumns'

function Attendances() {
  const { user } = useAuth()
  const [attendances, setAttendances] = useState<IAttendance[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttendances = useCallback(async () => {
    setLoading(true)

    try {
      const response = await DoctorsRepository.getAttendances({
        doctorId: user?._id
      })
      setAttendances(response)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(
        error.response?.data?.message ||
          'Erro ao carregar a listagem de atendimentos'
      )
    } finally {
      setLoading(false)
    }
  }, [user?._id])

  useEffect(() => {
    fetchAttendances()
  }, [fetchAttendances])

  const columns = useAttendancesColumns()

  return (
    <div className={styles.tableContent}>
      <Flex vertical className={styles.container}>
        <AuthLayoutHeader />

        <ListTable<IAttendance>
          dataSource={attendances}
          pageSize={8}
          columns={columns}
          loading={loading}
          onReload={fetchAttendances}
        />
      </Flex>
    </div>
  )
}

export default Attendances
