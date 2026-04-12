import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import DashboardRepository from '@/repositories/DashboardRepository'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'
import AttendanceQueueChartAdmin from './components/AttendanceQueueChartAdmin/AttendanceQueueChartAdmin'
import AttendanceQueueChartDoctor from './components/AttendanceQueueChartDoctor/AttendanceQueueChartDoctor'

export interface IAttendanceItemProps {
  item?: IDashboardQueueItem
  loading?: boolean
}

function AttendanceItem({ item, loading }: IAttendanceItemProps) {
  const { user } = useAuth()

  switch (user?.level) {
    case 'admin':
      return <AttendanceQueueChartAdmin item={item} loading={loading} />
    case 'doctor':
      return <AttendanceQueueChartDoctor item={item} loading={loading} />
    default:
      return <></>
  }
}

function AttendanceQueueChart() {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        const response = await DashboardRepository.getAttendanceQueue({
          params: {
            unitId: user?.unitId
          }
        })
        const data = response.data
        setData(data)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Erro ao pegar fila de atendimento'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.unitId])

  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${data?.length} atendimentos`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <AttendanceItem key={i} loading={loading} />
            ))
          : data.map((item) => (
              <AttendanceItem key={String(item._id)} item={item} />
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceQueueChart
