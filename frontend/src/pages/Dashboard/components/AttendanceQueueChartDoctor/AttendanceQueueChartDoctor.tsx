import DashboardCard from '@/components/DashboardCard/DashboardCard'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import DashboardRepository from '@/repositories/DashboardRepository'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChartDoctor.module.scss'

function AttendanceQueueChartDoctor() {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const VISIBLE_COUNT = 9
  const [showAll, setShowAll] = useState(false)
  const visibleData = showAll ? data : data.slice(0, VISIBLE_COUNT)
  const hiddenCount = data.length - VISIBLE_COUNT

  useEffect(() => {
    if (!user?.unitId) return

    async function fetchData() {
      setLoading(true)

      try {
        const response = await DashboardRepository.getAttendanceQueue({
          params: {
            unitId: user?.unitId
          }
        })

        setData(response?.data ?? [])
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Erro ao pegar fila do médico'
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
      asideText={`${data.length} atendimentos`}
      gridArea='attendanceQueueChart'
    >
      <div
        className={styles.queueList}
        style={{ alignSelf: 'flex-start', width: '100%' }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.queueItem}>
                <div className={styles.avatarSkeleton} />
                <span
                  className={styles.skeleton}
                  style={{ width: 120, height: 14 }}
                />
                <span
                  className={styles.skeleton}
                  style={{ width: 50, height: 14 }}
                />
                <span
                  className={styles.skeleton}
                  style={{ width: 80, height: 14 }}
                />
                <span
                  className={styles.skeleton}
                  style={{ width: 90, height: 14 }}
                />
                <div className={styles.tagSkeleton} />
                <div className={styles.buttonSkeleton} />
              </div>
            ))
          : visibleData.map((item) => (
              <div key={String(item._id)} className={styles.queueItem}>
                <UserBall name={item.patientName} />
                <strong className={styles.name}>{item.patientName}</strong>
                <span className={styles.detailAge}>-- anos</span>
                <span className={styles.detailSymptom}>--</span>
                <span className={styles.detailWaiting}>Aguardando...</span>
                <RiskTag risk={item.risk} />
                <button
                  className={styles.startButton}
                  onClick={() => console.log('Iniciar atendimento', item._id)}
                >
                  Iniciar Atendimento
                </button>
              </div>
            ))}
      </div>

      {!loading && !showAll && hiddenCount > 0 && (
        <button
          className={styles.showMoreButton}
          onClick={() => setShowAll(true)}
        >
          + {hiddenCount} atendimentos
        </button>
      )}
    </DashboardCard>
  )
}

export default AttendanceQueueChartDoctor
