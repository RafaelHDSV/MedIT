import DashboardCard from '@/components/DashboardCard/DashboardCard'
import RiskTag from '@/components/RiskTag/RiskTag'
import UserBall from '@/components/UserBall/UserBall'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import { StethoscopeIcon } from '@phosphor-icons/react'
import styles from './AttendanceQueueChart.module.scss'

interface QueueItem {
  name: string
  status: string
  risk: AttendanceRisk
}

interface IAttendanceItemProps {
  item: QueueItem
}

function AttendanceItem({ item }: IAttendanceItemProps) {
  return (
    <div className={styles.queueItem}>
      <div className={styles.leftAside}>
        <UserBall name={item.name} />

        <div className={styles.info}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.status}>{item.status}</span>
        </div>
      </div>

      <RiskTag risk={item.risk} />
    </div>
  )
}

function AttendanceQueueChart() {
  return (
    <DashboardCard
      title='Fila de Atendimento'
      icon={StethoscopeIcon}
      asideText={`${mockedAttendanceItem.length} atendimentos`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>
        {mockedAttendanceItem.map((item) => (
          <AttendanceItem key={`${item.name}_${item.risk}`} item={item} />
        ))}
      </div>
    </DashboardCard>
  )
}

export default AttendanceQueueChart

const mockedAttendanceItem: QueueItem[] = [
  {
    name: 'Rafael Vieira',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.NOT_URGENT
  },
  {
    name: 'Rafael Silva',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.EMERGENCY
  },
  {
    name: 'Rafael Vieira',
    status: 'Aguardando Triagem',
    risk: AttendanceRisk.NOT_URGENT
  },
  {
    name: 'Rafael Vieira',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.NOT_URGENT
  },
  {
    name: 'Matheus Takenaka',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.VERY_URGENT
  },
  {
    name: 'Matheus Takenaka',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.LESS_URGENT
  },
  {
    name: 'Rafael Silva',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.EMERGENCY
  },
  {
    name: 'Rafael Vieira',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.URGENT
  },
  {
    name: 'Matheus Takenaka',
    status: 'Aguardando Médico',
    risk: AttendanceRisk.VERY_URGENT
  }
]
