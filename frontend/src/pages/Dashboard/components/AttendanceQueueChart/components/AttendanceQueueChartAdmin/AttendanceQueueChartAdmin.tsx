import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import type { IAttendanceItemProps } from '../../AttendanceQueueChart'
import styles from '../../AttendanceQueueChart.module.scss'

function AttendanceQueueChartAdmin({ item, loading }: IAttendanceItemProps) {
  if (loading) {
    return (
      <div className={styles.queueItem}>
        <div className={styles.leftAside}>
          <div className={styles.avatarSkeleton} />

          <div className={styles.info}>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
        </div>

        <div className={styles.tagSkeleton} />
      </div>
    )
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.leftAside}>
        <UserBall name={item?.patientName} />

        <div className={styles.info}>
          <TooltipColumn className={styles.name} text={item?.patientName} />
          <TooltipColumn
            className={styles.status}
            text={item?.status ? AttendanceStatusLabels[item?.status] : ''}
          />
        </div>
      </div>

      <RiskTag risk={item?.risk} />
    </div>
  )
}

export default AttendanceQueueChartAdmin
