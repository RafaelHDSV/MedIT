import { AttendanceStatus } from '@/interfaces/IAttendance'
import { Skeleton } from 'antd'
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
  const inAttendanceDailyNumber = queueItems.find(
    (q) => q.status === AttendanceStatus.IN_ATTENDANCE
  )?.dailyNumber
  const myAttendanceDailyNumber = myQueueItem?.dailyNumber

  return (
    <div className={styles.queuePositionCard}>
      <span className={styles.queuePosLabel}>Sua posição na fila</span>

      {loading ? (
        <Skeleton active title={false} paragraph={{ rows: 1 }} />
      ) : myAttendanceDailyNumber ? (
        <span className={styles.queuePosNumber}>{myAttendanceDailyNumber}</span>
      ) : (
        <span className={styles.queuePosEmpty}>—</span>
      )}

      <span className={styles.queuePosSubInfo}>
        {inAttendanceCount > 0 ? (
          <>
            Atendendo paciente n°{' '}
            <strong>{inAttendanceDailyNumber ?? '?'}</strong>
          </>
        ) : (
          'Nenhum paciente em atendimento'
        )}
      </span>

      {estimatedWaitMinutes !== undefined && myAttendanceDailyNumber && (
        <span className={styles.queuePosSubInfo}>
          ~ {estimatedWaitMinutes} minuto{estimatedWaitMinutes !== 1 ? 's' : ''}
          de espera
        </span>
      )}
    </div>
  )
}

export default QueuePositionCard
