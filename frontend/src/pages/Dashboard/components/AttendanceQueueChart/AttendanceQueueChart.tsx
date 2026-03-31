import DashboardCard from '@/components/DashboardCard/DashboardCard'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import { faker } from '@faker-js/faker'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'

interface QueueItem {
  name: string
  status: string
  risk: AttendanceRisk
}

interface IAttendanceItemProps {
  item?: QueueItem
  loading?: boolean
}

function AttendanceItem({ item, loading }: IAttendanceItemProps) {
  if (loading) {
    return (
      <div className={styles.queueItem}>
        <div className={styles.leftAside}>
          <div className={`${styles.avatarSkeleton}`} />

          <div className={styles.info}>
            <span className={`${styles.name} ${styles.skeleton}`} />
            <span className={`${styles.status} ${styles.skeleton}`} />
          </div>
        </div>

        <div className={`${styles.tagSkeleton}`} />
      </div>
    )
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.leftAside}>
        <UserBall name={item?.name} />

        <div className={styles.info}>
          <TooltipColumn className={styles.name} text={item?.name} />
          <TooltipColumn className={styles.status} text={item?.status} />
        </div>
      </div>

      <RiskTag risk={item?.risk} />
    </div>
  )
}

function AttendanceQueueChart() {
  const [data, setData] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(mockedAttendanceItem)
      setLoading(false)
    }, 1000) //Vieira: Simula api

    return () => clearTimeout(timeout)
  }, [])

  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${data.length} atendimentos`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <AttendanceItem key={i} loading={loading} />
            ))
          : data.map((item) => (
              <AttendanceItem key={`${item.name}_${item.risk}`} item={item} />
            ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceQueueChart

const mockedAttendanceItem: QueueItem[] = faker.helpers.multiple(
  () => {
    return {
      name: faker.person.fullName(),
      status: faker.helpers.arrayElement([
        'Em transporte',
        'Entrada',
        'Aguardando Triagem',
        'Em Triagem',
        'Aguardando Médico',
        'Em Atendimento',
        'Aguardando Exames',
        'Aguardando Resultados',
        'Aguardando Alta'
      ]),
      risk: faker.helpers.arrayElement(Object.values(AttendanceRisk))
    }
  },
  { count: 46 }
)
