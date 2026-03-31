import { api } from '@/api/api'
import DashboardCard from '@/components/DashboardCard/DashboardCard'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import type { IError } from '@/interfaces/IError'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'

interface QueueItem {
  _id: string
  patientName: string
  status: string
  risk: AttendanceRisk
}

interface IAttendanceItemProps {
  item?: QueueItem
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
          <TooltipColumn className={styles.status} text={item?.status} />
        </div>
      </div>

      <RiskTag risk={item?.risk} />
    </div>
  )
}

function AttendanceQueueChart() {
  const [data, setData] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/dashboard/attendance-queue')
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
  }, [])

  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${data.length} atendimentos`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <AttendanceItem key={i} loading={loading} />
            ))
          : data.map((item) => (
              <AttendanceItem
                key={`${item.patientName}_${item.risk}`}
                item={item}
              />
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceQueueChart
