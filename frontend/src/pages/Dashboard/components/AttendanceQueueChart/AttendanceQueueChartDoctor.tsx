import DashboardCard from '@/components/DashboardCard/DashboardCard'
import UserBall from '@/components/UserBall/UserBall'
import { handleApiError } from '@/helpers/handleApiError' 
import RiskTag from '@/components/RiskTag/RiskTag' 
import { useAuth } from '@/hooks/useAuth'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import DashboardRepository from '@/repositories/DashboardRepository'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'

function AttendanceQueueChartDoctor() {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [loading, setLoading] = useState(true)

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
      title='Meus Atendimentos'
      icon={StethoscopeIcon}
      asideText={`${data.length} pacientes`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>Carregando...</div>
            ))
          : data.map((item) => (
              <div key={String(item._id)} className={styles.queueItem}>
                <div className={styles.leftAside}>
                  <UserBall name={item.patientName} />

                  <div className={styles.info}>
                    <strong className={styles.name}>{item.patientName}</strong>

                    <div className={styles.details}>
                      <span>Idade não informada</span>
                      <span>Sintoma não informado</span>
                      <span>Aguardando...</span>
                    </div>
                  </div>
                </div>

                <div className={styles.rightAside}>
                  <RiskTag risk={item.risk} />

                  <button className={styles.startButton}>
                    Iniciar Atendimento
                  </button>
                </div>
              </div>
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceQueueChartDoctor
