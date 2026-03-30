import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { useAuth } from '@/hooks/useAuth'
import type { IError } from '@/interfaces/IError'
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
import { message } from 'antd'
import axios, { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import AttendanceByTimeChart from './components/AttendanceByTimeChart/AttendanceByTimeChart'
import AttendanceQueueChart from './components/AttendanceQueueChart/AttendanceQueueChart'
import DashboardStatusCard from './components/DashboardStatusCard/DashboardStatusCard'
import styles from './Dashboard.module.scss'

function Dashboard() {
  const { user } = useAuth()
  const [occupancyRate, setOccupancyRate] = useState(0)

  useEffect(() => {
    async function fetchOccupancyRate() {
      try {
        const response = await api.get(`/units/${user?.unitId}`)
        const data = response.data.data.maxOccupancy
        // TODO: Atualizar para pegar os atendimentos correntes da unidade
        const occupied = 47
        const occupancyRate = Math.round((occupied / data) * 100)
        setOccupancyRate(occupancyRate)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao pegar taxa de ocupação'
        )
      }
    }

    fetchOccupancyRate()
  }, [user?.unitId])

  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          { Icon: DoorOpenIcon, value: '142', label: 'Entradas' },
          { Icon: HourglassIcon, value: '46', label: 'Em atendimento' },
          { Icon: CheckCircleIcon, value: '96', label: 'Atendidos' },
          { Icon: BedIcon, value: `${occupancyRate}%`, label: 'Ocupação' },
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
  }, [user?.level, occupancyRate])

  const content = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return (
          <>
            <AttendanceByTimeChart />
            <AttendanceQueueChart />
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
    <>
      <AuthLayoutHeader />

      <div className={styles.container}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardStatusCard
            key={label}
            Icon={Icon}
            value={value}
            label={label}
          />
        ))}

        {content}
      </div>
    </>
  )
}
export default Dashboard
