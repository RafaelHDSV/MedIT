import { api } from '@/api/api'
import DashboardCard from '@/components/DashboardCard/DashboardCard'
import type { IError } from '@/interfaces/IError'
import { ClockCountdownIcon } from '@phosphor-icons/react'
import { message, Tooltip } from 'antd'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import styles from './AttendanceByTimeChart.module.scss'

interface IAttendanceByTime {
  hour: number
  total: number
}

function AttendanceByTimeChart() {
  const [data, setData] = useState<IAttendanceByTime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAttendanceByTime() {
      setLoading(true)
      try {
        const response = await api.get(
          '/dashboard/dashboard-attendance-by-time'
        )
        const data = response.data.data
        setData(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao pegar atendimentos por hora'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceByTime()
  }, [])

  return (
    <DashboardCard
      title='Atendimentos por Hora'
      icon={ClockCountdownIcon}
      asideText='30 p/ hora'
      gridArea='attendanceByTimeChart'
    >
      <div className={styles.chart}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`${styles.barContainer} ${styles.skeleton}`}
              >
                <div className={`${styles.bar} ${styles.barSkeleton}`} />
                <span className={`${styles.label} ${styles.skeleton}`} />
              </div>
            ))
          : data.map((item, index) => (
              <div key={index} className={styles.barContainer}>
                <Tooltip title={`${item.total} atendimentos às ${item.hour}h`}>
                  <div
                    className={styles.bar}
                    style={{ height: `${item.total}px` }}
                  />
                </Tooltip>
                <span className={styles.label}>{item.hour}h</span>
              </div>
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceByTimeChart
