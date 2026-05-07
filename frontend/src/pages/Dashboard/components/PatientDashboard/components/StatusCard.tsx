import { AttendanceStatusLabels, type AttendanceStatus } from '@/interfaces/IAttendance'
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
        <div className={styles.skeletonLarge} />
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
