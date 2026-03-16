import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { useAuth } from '@/hooks/useAuth'
import { UserRoles } from '@/interfaces/IUser'
import {
  BedIcon,
  BombIcon,
  CheckCircleIcon,
  DoorOpenIcon,
  HourglassIcon,
  TimerIcon,
  UsersThreeIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import { useMemo } from 'react'
import styles from './Dashboard.module.scss'
import DashboardCard from './DashboardCard/DashboardCard'

function Dashboard() {
  const { user } = useAuth()
  const cardsData = useMemo(() => {
    switch (user?.role) {
      case UserRoles.ADMIN:
        return [
          { Icon: DoorOpenIcon, value: '142', label: 'Entradas' },
          { Icon: CheckCircleIcon, value: '96', label: 'Atendidos' },
          { Icon: HourglassIcon, value: '46', label: 'Em atendimento' },
          { Icon: BedIcon, value: '52%', label: 'Ocupação' },
          { Icon: TimerIcon, value: '23min', label: 'Tempo médio' },
          { Icon: BombIcon, value: '8', label: 'Risco alto' }
        ]
      case UserRoles.DOCTOR:
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
      case UserRoles.NURSE:
        return [
          { Icon: HourglassIcon, value: '25', label: 'Pacientes aguardando' },
          {
            Icon: CheckCircleIcon,
            value: '96',
            label: 'Pacientes triados hoje'
          },
          { Icon: TimerIcon, value: '18min', label: 'Tempo médio' }
        ]
      case UserRoles.PATIENT:
        return []
      default:
        return []
    }
  }, [user?.role])

  return (
    <section>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

      <div className={styles.cardsContainer}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardCard key={label} Icon={Icon} value={value} label={label} />
        ))}
      </div>
    </section>
  )
}

export default Dashboard
