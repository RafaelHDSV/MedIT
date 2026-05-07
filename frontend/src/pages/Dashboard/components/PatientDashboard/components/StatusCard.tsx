import {
  AttendanceStatusLabels,
  type AttendanceStatus
} from '@/interfaces/IAttendance'
import { Skeleton } from 'antd'
import styles from '../PatientDashboard.module.scss'

interface IStatusCardProps {
  loading: boolean
  status: AttendanceStatus | undefined
  nextStatus: AttendanceStatus | null
}

function StatusCard({ loading, status, nextStatus }: IStatusCardProps) {
  return (
    <div className={styles.statusCard}>
      <span className={styles.statusLabel}>Seu status atual é</span>

      {loading ? (
        <Skeleton active title={false} paragraph={{ rows: 1 }} />
      ) : status ? (
        <>
          <span className={styles.statusValue}>
            {AttendanceStatusLabels[status]}
          </span>
          {nextStatus && (
            <span className={styles.statusNext}>
              Seu próximo status é{' '}
              <span>{AttendanceStatusLabels[nextStatus]}</span>
            </span>
          )}
        </>
      ) : (
        <span className={styles.statusEmpty}>—</span>
      )}
    </div>
  )
}

export default StatusCard
