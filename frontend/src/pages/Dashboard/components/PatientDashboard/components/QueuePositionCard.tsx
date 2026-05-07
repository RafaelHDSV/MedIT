import { AttendanceStatus } from '@/interfaces/IAttendance'
import type { IPatientQueueItem } from '../IPatientDashboard'
import styles from '../PatientDashboard.module.scss'

interface IQueuePositionCardProps {
  loading: boolean
  myQueueItem: IPatientQueueItem | undefined
  inAttendanceCount: number
  queueItems: IPatientQueueItem[]
  estimatedWaitMinutes?: number
}

function QueuePositionCard({
  loading,
  myQueueItem,
  inAttendanceCount,
  queueItems,
  estimatedWaitMinutes
}: IQueuePositionCardProps) {
  const inAttendancePosition = queueItems.find(
    (q) => q.status === AttendanceStatus.IN_ATTENDANCE
  )?.queuePosition

  return (
    <div className={styles.queuePositionCard}>
      <span className={styles.queuePosLabel}>Sua posição na fila</span>

      {loading ? (
        <div className={styles.skeletonLarge} />
      ) : myQueueItem?.queuePosition ? (
        <span className={styles.queuePosNumber}>
          {myQueueItem.queuePosition}º
        </span>
      ) : (
        <span className={styles.queuePosEmpty}>—</span>
      )}

      <span className={styles.queuePosSubInfo}>
        {inAttendanceCount > 0 ? (
          <>
            Atendendo paciente n°{' '}
            <strong>{inAttendancePosition ?? '?'}</strong>
          </>
        ) : (
          'Nenhum paciente em atendimento'
        )}
      </span>

      {estimatedWaitMinutes !== undefined && myQueueItem?.queuePosition && (
        <span className={styles.queuePosSubInfo}>
          ~ {estimatedWaitMinutes} minuto{estimatedWaitMinutes !== 1 ? 's' : ''}
          de espera
        </span>
      )}
    </div>
  )
}

export default QueuePositionCard
