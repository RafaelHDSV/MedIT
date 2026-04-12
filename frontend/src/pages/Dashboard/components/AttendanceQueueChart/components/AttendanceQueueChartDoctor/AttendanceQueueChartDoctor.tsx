import Button from '@/components/Button/Button'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import type { IAttendanceItemProps } from '../../AttendanceQueueChart'
import styles from '../../AttendanceQueueChart.module.scss'

function AttendanceQueueChartDoctor({ item, loading }: IAttendanceItemProps) {
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

      {/* VIEIRA: Adicionar back */}
      <TooltipColumn className={styles.detailsSecondary} text='20 anos' />
      <TooltipColumn className={styles.detailsSecondary} text='Naúsea' />
      <TooltipColumn
        className={styles.detailsSecondary}
        text='Aguardando há 2 horas'
      />

      <div className={styles.detailsRisk}>
        <RiskTag risk={item?.risk} />
      </div>

      <Button
        fontSize={12}
        buttonHeight='2rem'
        onClick={() => console.log('Iniciar atendimento', item?._id)}
      >
        Iniciar Atendimento
      </Button>
    </div>
  )
}

export default AttendanceQueueChartDoctor
