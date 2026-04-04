import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { Periods } from '@/interfaces/globals'
import type { IDashboardAttendanceByTime } from '@/interfaces/IDashboard'
import DashboardRepository from '@/repositories/DashboardRepository'
import masks from '@/utils/masks'
import { ClockCountdownIcon } from '@phosphor-icons/react'
import { Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import styles from './AttendanceByTimeChart.module.scss'

interface IAttendanceByTimeChartProps {
  selectedPeriod: Periods
}

function AttendanceByTimeChart({
  selectedPeriod
}: IAttendanceByTimeChartProps) {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardAttendanceByTime[]>([])
  const [loading, setLoading] = useState(true)
  const max = Math.max(...data.map((d) => d.total), 1)
  const avg =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.total, 0) / data.length
      : 0

  useEffect(() => {
    async function fetchAttendanceByTime() {
      setLoading(true)
      try {
        const response = await DashboardRepository.getAttendanceByTime({
          params: {
            unitId: user?.unitId,
            period: selectedPeriod
          }
        })
        const data = response.data
        setData(data)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Erro ao pegar atendimentos por hora'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceByTime()
  }, [selectedPeriod, user?.unitId])

  function getPeriodConfig(period: string) {
    switch (period) {
      case 'day':
        return {
          title: 'Atendimentos por Hora',
          suffix: 'h',
          aside: 'por hora'
        }
      case 'week':
        return {
          title: 'Atendimentos por Dia',
          suffix: '',
          aside: 'por dia'
        }
      case 'month':
        return {
          title: 'Atendimentos por Dia',
          suffix: '',
          aside: 'por dia'
        }
      case 'year':
        return {
          title: 'Atendimentos por Mês',
          suffix: '',
          aside: 'por mês'
        }
      default:
        return {
          title: '',
          suffix: '',
          aside: ''
        }
    }
  }

  const periodLabels = getPeriodConfig(selectedPeriod)

  return (
    <DashboardCard
      title={periodLabels.title}
      icon={ClockCountdownIcon}
      asideText={`${Math.round(avg)} ${periodLabels.aside}`}
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
                <Tooltip
                  title={
                    item.total > 0
                      ? `${masks(item.total, 'number')} atendimentos`
                      : 'Sem atendimentos'
                  }
                >
                  <div
                    className={`${styles.bar} ${item.total === 0 ? styles.barEmpty : ''}`}
                    style={{
                      height:
                        item.total > 0 ? `${(item.total / max) * 180}px` : '8px'
                    }}
                  />
                </Tooltip>
                <span className={styles.label}>
                  {item.label}
                  {periodLabels.suffix}
                </span>
              </div>
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceByTimeChart
