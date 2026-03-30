import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { useAuth } from '@/hooks/useAuth'
import type {
  IAdminStatusCard,
  IDoctorStatusCard,
  INurseStatusCard
} from '@/interfaces/IDashboardStatusCards'
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
  const [adminData, setAdminData] = useState<IAdminStatusCard>()
  const [doctorData, setDoctorData] = useState<IDoctorStatusCard>()
  const [nurseData, setNurseData] = useState<INurseStatusCard>()

  useEffect(() => {
    async function fetchOccupancyRate() {
      try {
        const response = await api.get(`/dashboard/dashboard-status-cards`, {
          params: { unitId: user?.unitId }
        })
        const data = response.data.data
        const { admin, doctor, nurse } = data

        setAdminData(admin)
        setDoctorData(doctor)
        setNurseData(nurse)
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
          { Icon: DoorOpenIcon, value: adminData?.entries, label: 'Entradas' },
          {
            Icon: HourglassIcon,
            value: adminData?.inAttendance,
            label: 'Em atendimento'
          },
          {
            Icon: CheckCircleIcon,
            value: adminData?.attended,
            label: 'Atendidos'
          },
          {
            Icon: BedIcon,
            value: `${adminData?.occupancy}%`,
            label: 'Ocupação'
          },
          {
            Icon: TimerIcon,
            value: `${adminData?.averageTime}min`,
            label: 'Tempo médio'
          },
          { Icon: BombIcon, value: adminData?.highRisk, label: 'Risco alto' }
        ]
      case UserLevels.DOCTOR:
        return [
          {
            Icon: HourglassIcon,
            value: doctorData?.waitingPatients,
            label: 'Pacientes aguardando'
          },
          {
            Icon: CheckCircleIcon,
            value: doctorData?.attended,
            label: 'Atendimentos realizados'
          },
          {
            Icon: TimerIcon,
            value: `${doctorData?.averageTime}min`,
            label: 'Tempo médio'
          },
          {
            Icon: UsersThreeIcon,
            value: `${doctorData?.assertiveness}%`,
            label: 'Assertividade IA vs Médico(a)'
          }
        ]
      case UserLevels.NURSE:
        return [
          {
            Icon: HourglassIcon,
            value: nurseData?.waitingPatients,
            label: 'Pacientes aguardando'
          },
          {
            Icon: CheckCircleIcon,
            value: nurseData?.triagedPatients,
            label: 'Pacientes triados hoje'
          },
          {
            Icon: TimerIcon,
            value: `${nurseData?.averageTime}min`,
            label: 'Tempo médio'
          }
        ]
      case UserLevels.PATIENT:
        return []
      default:
        return []
    }
  }, [user?.level, adminData, doctorData, nurseData])

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
