import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { type IAttendance } from '@/interfaces/IAttendance'
import NursesRepository from '@/repositories/NursesRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import { useTriagesColumns } from './hooks/useTriagesColumns'

function ITriages() {
  const { user } = useAuth()
  const [triages, setTriages] = useState<IAttendance[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttendances = useCallback(async () => {
    setLoading(true)

    try {
      const response = await NursesRepository.getAttendances({
        nurseId: user?._id,
        completedTriage: true
      })
      setTriages(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de atendimentos'
      })
    } finally {
      setLoading(false)
    }
  }, [user?._id])

  useEffect(() => {
    fetchAttendances()
  }, [fetchAttendances])

  const columns = useTriagesColumns()

  return (
    <div className={styles.tableContent}>
      <Flex vertical className={styles.container}>
        <AuthLayoutHeader />

        <ListTable<IAttendance>
          dataSource={triages}
          columns={columns}
          loading={loading}
          onReload={fetchAttendances}
        />
      </Flex>
    </div>
  )
}

export default ITriages
