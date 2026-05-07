import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { riskColors } from '@/components/Risk/riskConstants'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import { StethoscopeIcon } from '@phosphor-icons/react'
import type { IPatientQueueItem } from '../../IPatientDashboard'
import styles from './PatientQueueList.module.scss'

interface IPatientQueueListProps {
  queueItems: IPatientQueueItem[]
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

function PatientQueueList({ queueItems, loading }: IPatientQueueListProps) {
  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${queueItems.length} ${queueItems.length !== 1 ? 'atendimentos' : 'atendimento'}`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <QueueItemSkeleton key={i} />
            ))
          : queueItems.map((item) => {
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
                    {item.number ?? '?'}
                  </div>

                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.patientName}</span>
                    <span className={styles.itemStatus}>
                      {AttendanceStatusLabels[item.status]}
                    </span>
                  </div>

                  <span
                    className={styles.riskTag}
                    style={
                      riskColor
                        ? ({
                            '--tag-color': riskColor.color,
                            '--tag-bg': riskColor.bgColor
                          } as React.CSSProperties & Record<string, string>)
                        : undefined
                    }
                  >
                    {item.risk === 'emergency' ||
                    item.risk === 'veryUrgent' ||
                    item.risk === 'urgent'
                      ? 'Alto'
                      : item.risk === 'lessUrgent'
                        ? 'Médio'
                        : 'Baixo'}
                  </span>
                </div>
              )
            })}
      </div>
    </DashboardCard>
  )
}

export default PatientQueueList
