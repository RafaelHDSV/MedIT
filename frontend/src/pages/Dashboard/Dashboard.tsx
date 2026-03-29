import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import {
  BedIcon,
  BombIcon,
  CheckCircleIcon,
  DoorOpenIcon,
  HourglassIcon,
  TimerIcon,
  UsersThreeIcon
} from '@phosphor-icons/react'
import { useMemo } from 'react'
import AttendanceHourlyChart from './components/AttendanceHourlyChart/AttendanceHourlyChart'
import AttendanceQueueChart from './components/AttendanceQueueChart/AttendanceQueueChart'
import DashboardCard from './components/DashboardCard/DashboardCard'
import styles from './Dashboard.module.scss'

function Dashboard() {
  const { user } = useAuth()
  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          { Icon: DoorOpenIcon, value: '142', label: 'Entradas' },
          { Icon: CheckCircleIcon, value: '96', label: 'Atendidos' },
          { Icon: HourglassIcon, value: '46', label: 'Em atendimento' },
          { Icon: BedIcon, value: '52%', label: 'Ocupação' },
          { Icon: TimerIcon, value: '23min', label: 'Tempo médio' },
          { Icon: BombIcon, value: '8', label: 'Risco alto' }
        ]
      case UserLevels.DOCTOR:
        return [
          { Icon: HourglassIcon, value: '14', label: 'Pacientes aguardando' },
          {
            Icon: CheckCircleIcon,
            value: '96',
            label: 'Atendimentos realizados'
          },
          { Icon: TimerIcon, value: '18min', label: 'Tempo médio' },
          {
            Icon: UsersThreeIcon,
            value: '52%',
            label: 'Assertividade IA vs Médico'
          }
        ]
      case UserLevels.NURSE:
        return [
          { Icon: HourglassIcon, value: '25', label: 'Pacientes aguardando' },
          {
            Icon: CheckCircleIcon,
            value: '96',
            label: 'Pacientes triados hoje'
          },
          { Icon: TimerIcon, value: '18min', label: 'Tempo médio' }
        ]
      case UserLevels.PATIENT:
        return []
      default:
        return []
    }
  }, [user?.level])

  return (
    <section>
      <AuthLayoutHeader />

      <div className={styles.cardsContainer}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardCard key={label} Icon={Icon} value={value} label={label} />
        ))}

        <AttendanceHourlyChart />
        <AttendanceQueueChart />
      </div>
    </section>
  )
}
export default Dashboard
