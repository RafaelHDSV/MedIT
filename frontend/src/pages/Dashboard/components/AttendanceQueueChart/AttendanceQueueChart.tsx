import { api } from '@/api/api'
import DashboardCard from '@/components/DashboardCard/DashboardCard'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { useAuth } from '@/hooks/useAuth'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import type { IError } from '@/interfaces/IError'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'

interface IAttendanceItemProps {
  item?: IDashboardQueueItem
  loading?: boolean
}

function AttendanceItem({ item, loading }: IAttendanceItemProps) {
  if (loading) {
    return (
      <div className={styles.queueItem}>
        <div className={styles.leftAside}>
          <div className={`${styles.avatarSkeleton}`} />

          <div className={styles.info}>
            <span className={`${styles.name} ${styles.skeleton}`} />
            <span className={`${styles.status} ${styles.skeleton}`} />
          </div>
        </div>

        <div className={`${styles.tagSkeleton}`} />
      </div>
    )
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.leftAside}>
        <UserBall name={item?.patientName} />

        <div className={styles.info}>
          <TooltipColumn className={styles.name} text={item?.patientName} />
          <TooltipColumn
            className={styles.status}
            text={item?.status ? AttendanceStatusLabels[item?.status] : ''}
          />
        </div>
      </div>

      <RiskTag risk={item?.risk} />
    </div>
  )
}

interface IAttendanceQueueChartProps {
  selectedPeriod: string
}

function AttendanceQueueChart({ selectedPeriod }: IAttendanceQueueChartProps) {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        const response = await api.get('/dashboard/attendance-queue', {
          params: {
            unitId: user?.unitId,
            period: selectedPeriod
          }
        })
        const data = response.data.data
        setData(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao pegar fila de atendimento'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.unitId, selectedPeriod])

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
