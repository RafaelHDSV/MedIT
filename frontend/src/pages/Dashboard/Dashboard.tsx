import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { InputSelect } from '@/components/FormComponents/FormComponents'
import { useAuth } from '@/hooks/useAuth'
import type { IDashboardStatusCards } from '@/interfaces/IDashboard'
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
  const [dashboardStatusData, setDashboardStatusData] =
    useState<IDashboardStatusCards>()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('day')

  useEffect(() => {
    async function fetchDashboardStatus() {
      setLoading(true)

      try {
        const response = await api.get(`/dashboard/status-cards`, {
          params: {
            unitId: user?.unitId,
            level: user?.level,
            period: selectedPeriod
          }
        })
        const data = response.data.data
        setDashboardStatusData(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao pegar dados do dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStatus()
  }, [user?.unitId, user?.level, selectedPeriod])

  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          {
            Icon: DoorOpenIcon,
            value: dashboardStatusData?.entries,
            label: 'Entradas'
          },
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.inAttendance,
            label: 'Em atendimento'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.attended,
            label: 'Atendidos'
          },
          {
            Icon: BedIcon,
            value: dashboardStatusData?.occupancy
              ? `${dashboardStatusData?.occupancy}%`
              : undefined,
            label: 'Ocupação'
          },
          {
            Icon: TimerIcon,
            value: dashboardStatusData?.averageTime
              ? `${dashboardStatusData?.averageTime}min`
              : undefined,
            label: 'Tempo médio'
          },
          {
            Icon: BombIcon,
            value: dashboardStatusData?.highRisk,
            label: 'Risco alto'
          }
        ]
      case UserLevels.DOCTOR:
        return [
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.waitingPatients,
            label: 'Pacientes aguardando'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.attended,
            label: 'Atendimentos realizados'
          },
          {
            Icon: TimerIcon,
            value: `${dashboardStatusData?.averageTime}min`,
            label: 'Tempo médio'
          },
          {
            Icon: UsersThreeIcon,
            value: `${dashboardStatusData?.assertiveness}%`,
            label: 'Assertividade IA vs Médico(a)'
          }
        ]
      case UserLevels.NURSE:
        return [
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.waitingPatients,
            label: 'Pacientes aguardando'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.triagedPatients,
            label: 'Pacientes triados hoje'
          },
          {
            Icon: TimerIcon,
            value: `${dashboardStatusData?.averageTime}min`,
            label: 'Tempo médio'
          }
        ]
      case UserLevels.PATIENT:
        return []
      default:
        return []
    }
  }, [user?.level, dashboardStatusData])

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
      <AuthLayoutHeader
        actionComponent={
          <InputSelect
            placeholder='Período'
            options={[
              { label: 'Dia', value: 'day' },
              { label: 'Semana', value: 'week' },
              { label: 'Mês', value: 'month' },
              { label: 'Ano', value: 'year' }
            ]}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        }
      />

      <div className={styles.container}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardStatusCard
            key={label}
            Icon={Icon}
            value={value}
            label={label}
            loading={loading}
          />
        ))}

        {content}
      </div>
    </>
  )
}
export default Dashboard
