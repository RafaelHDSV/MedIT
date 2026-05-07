import DashboardCard from '@/components/DashboardCard/DashboardCard'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import { riskColors } from '@/components/Risk/riskConstants'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import type { IPatientQueueItem } from '../../IPatientDashboard'
import styles from './PatientQueueList.module.scss'

const INITIAL_VISIBLE = 7

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
  const [expanded, setExpanded] = useState(false)

  const visibleItems =
    expanded ? queueItems : queueItems.slice(0, INITIAL_VISIBLE)
  const hiddenCount = queueItems.length - INITIAL_VISIBLE

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
          : visibleItems.map((item) => {
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
                            '--badge-color': '#fff'
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
                    {item.risk === 'emergency' || item.risk === 'veryUrgent' || item.risk === 'urgent'
                      ? 'Alto'
                      : item.risk === 'lessUrgent'
                        ? 'Médio'
                        : 'Baixo'}
                  </span>
                </div>
              )
            })}

        {!loading && hiddenCount > 0 && (
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded
              ? 'Mostrar menos'
              : `+ ${hiddenCount} atendimento${hiddenCount !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </DashboardCard>
  )
}

export default PatientQueueList
