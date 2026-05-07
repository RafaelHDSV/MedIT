import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { riskColors } from '@/components/Risk/riskConstants'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import { StethoscopeIcon } from '@phosphor-icons/react'
import type { IPatientQueueItem } from '../../IPatientDashboard'
import styles from './PatientQueueList.module.scss'

interface IPatientQueueListProps {
  operationalQueueItems: IPatientQueueItem[]
  onTheWayQueueItems: IPatientQueueItem[]
  totalActiveCount: number
  loading: boolean
}

function QueueItemSkeleton() {
  return (
    <div className={styles.queueItem}>
      <div className={styles.numberBadgeSkeleton} />
      <div className={styles.itemInfo}>
        <span className={styles.skeleton} />
        <span className={`${styles.skeleton} ${styles.skeletonShort}`} />
      </div>
      <div className={styles.tagSkeleton} />
    </div>
  )
}

function PatientQueueList({
  operationalQueueItems,
  onTheWayQueueItems,
  totalActiveCount,
  loading
}: IPatientQueueListProps) {
  const renderItem = (item: IPatientQueueItem) => {
    const riskColor = item.risk ? riskColors[item.risk] : undefined

    return (
      <div
        key={item._id}
        className={`${styles.queueItem} ${item.isCurrentUser ? styles.currentUser : ''}`}
      >
        <div
          className={styles.numberBadge}
          style={
            riskColor
              ? ({
                  '--badge-bg': riskColor.color,
                  '--badge-color': 'var(--white)'
                } as React.CSSProperties & Record<string, string>)
              : undefined
          }
        >
          {item.queuePosition}
        </div>

        <div className={styles.itemInfo}>
          <span className={styles.itemName}>{item.patientName}</span>
          <span className={styles.itemStatus}>
            {AttendanceStatusLabels[item.status]}
          </span>
        </div>

        <RiskTag
          risk={item.risk}
          className={item.isCurrentUser ? styles.currentUserRiskTag : ''}
        />
      </div>
    )
  }

  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${totalActiveCount} ${totalActiveCount !== 1 ? 'atendimentos' : 'atendimento'}`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <QueueItemSkeleton key={i} />
            ))
          : (
              <>
                <section className={styles.queueSection}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Fila operacional</span>
                    <span className={styles.sectionHint}>
                      Apenas pacientes presentes no hospital
                    </span>
                  </div>
                  {operationalQueueItems.map(renderItem)}
                </section>

                {onTheWayQueueItems.length > 0 && (
                  <section className={styles.queueSection}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>A caminho</span>
                      <span className={styles.sectionHint}>
                        Pré-fila com vantagem de tempo limitada a 30 min no mesmo
                        risco
                      </span>
                    </div>
                    {onTheWayQueueItems.map(renderItem)}
                  </section>
                )}
              </>
            )}
      </div>
    </DashboardCard>
  )
}

export default PatientQueueList
