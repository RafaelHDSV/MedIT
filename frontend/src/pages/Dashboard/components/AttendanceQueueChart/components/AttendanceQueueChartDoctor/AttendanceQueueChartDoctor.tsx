import Button from '@/components/Button/Button'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { handleApiError } from '@/helpers/handleApiError'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import { ROUTES } from '@/routes/constants'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import { timeAgo } from '@/utils/timeAgo'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAttendanceItemProps } from '../../AttendanceQueueChart'
import styles from '../../AttendanceQueueChart.module.scss'

function AttendanceQueueChartDoctor({ item, loading }: IAttendanceItemProps) {
  const navigate = useNavigate()
  const [claiming, setClaiming] = useState(false)

  if (loading) {
    return (
      <div className={styles.queueItem}>
        <div className={styles.leftAside}>
          <div className={styles.avatarSkeleton} />

          <div className={styles.info}>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>

          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
          <span className={styles.skeleton} />
        </div>

        <div className={styles.tagSkeleton} />
      </div>
    )
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.patientInfo}>
        <UserBall name={item?.patientName} />
        <TooltipColumn className={styles.name} text={item?.patientName} />
      </div>

      <div className={styles.detailsSecondary}>
        <TooltipColumn
          text={`${getAgeByBirthDate(item?.patientBirthDate)} anos`}
        />
      </div>
      <div className={styles.detailsSecondary}>
        <TooltipColumn text={item?.complaint} />
      </div>
      <div className={styles.detailsSecondary}>
        <TooltipColumn text={timeAgo(item?.date)} />
      </div>

      <div className={styles.detailsRisk}>
        <RiskTag risk={item?.risk} />
      </div>

      <Button
        fontSize={12}
        buttonHeight='2rem'
        loading={claiming}
        onClick={async () => {
          if (!item?._id) return
          try {
            setClaiming(true)
            await AttendancesFlowRepository.claimConsultation({
              attendanceId: String(item._id)
            })
            navigate(
              ROUTES.ATTENDANCE_DETAILS.path.replace(
                ':attendanceId',
                String(item._id)
              )
            )
          } catch (err) {
            handleApiError({
              err,
              defaultMessage: 'Não foi possível assumir este atendimento.'
            })
          } finally {
            setClaiming(false)
          }
        }}
      >
        Iniciar Atendimento
      </Button>
    </div>
  )
}

export default AttendanceQueueChartDoctor
