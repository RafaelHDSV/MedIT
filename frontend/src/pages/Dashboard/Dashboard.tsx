import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
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
import { Flex } from 'antd'
import { useMemo } from 'react'
import styles from './Dashboard.module.scss'
import DashboardCard from './DashboardCard/DashboardCard'

function Dashboard() {
  const { user } = useAuth()
  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          { Icon: DoorOpenIcon, value: '142', label: 'Entradas' },
          { Icon: HourglassIcon, value: '46', label: 'Em atendimento' },
          { Icon: CheckCircleIcon, value: '96', label: 'Atendidos' },
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
            label: 'Assertividade IA vs Médico(a)'
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

  const content = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return (
          <>
            <div className={styles.attendance}>Atendimentos por hora</div>

            <div className={styles.queue}>Fila de Atendimento</div>
          </>
        )
      case UserLevels.DOCTOR:
        return <></>
      case UserLevels.NURSE:
        return <></>
      case UserLevels.PATIENT:
        return <></>
      default:
        return <></>
    }
  }, [user?.level])

  return (
    <section>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

      <div className={styles.container}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardCard key={label} Icon={Icon} value={value} label={label} />
        ))}

        {content}
      </div>
    </section>
  )
}

export default Dashboard
