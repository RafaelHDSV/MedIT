import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { InputSelect } from '@/components/FormComponents/FormComponents'
import ReloadButton from '@/components/ReloadButton/ReloadButton'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { Periods, PeriodsLabels } from '@/interfaces/globals'
import type { IDashboardStatusCards } from '@/interfaces/IDashboard'
import { UserLevels } from '@/interfaces/IUser'
import DashboardRepository from '@/repositories/DashboardRepository'
import { ROUTES } from '@/routes/constants'
import masks from '@/utils/masks'
import { timeFormatter } from '@/utils/timeFormatter'
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AttendanceByTimeChart from './components/AttendanceByTimeChart/AttendanceByTimeChart'
import AttendanceQueueChart from './components/AttendanceQueueChart/AttendanceQueueChart'
import DashboardStatusCard from './components/DashboardStatusCard/DashboardStatusCard'
import styles from './Dashboard.module.scss'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboardStatusData, setDashboardStatusData] =
    useState<IDashboardStatusCards>()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.WEEK)
  const [reload, setReload] = useState(false)
  const shouldShowPeriodSelect = user?.level !== UserLevels.PATIENT

  const fetchDashboardStatus = useCallback(async () => {
    setLoading(true)

    try {
      const response = await DashboardRepository.getStatusCards({
        params: {
          userId: user?._id,
          unitId: user?.unitId,
          level: user?.level,
          period: selectedPeriod
        }
      })
      const data = response.data
      setDashboardStatusData(data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao pegar dados do dashboard'
      })
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod, user])

  useEffect(() => {
    fetchDashboardStatus()
  }, [fetchDashboardStatus])

  function onReload() {
    fetchDashboardStatus()
    setReload((prev) => !prev)
  }

  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          {
            Icon: DoorOpenIcon,
            value: dashboardStatusData?.entries
              ? masks(dashboardStatusData?.entries, 'number')
              : undefined,
            label: 'Entradas'
          },
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.inAttendance,
            label: 'Em atendimento'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.attended
              ? masks(dashboardStatusData?.attended, 'number')
              : undefined,
            label: 'Atendidos'
          },
          {
            Icon: BedIcon,
            value:
              dashboardStatusData?.occupancy !== undefined
                ? `${dashboardStatusData?.occupancy}%`
                : undefined,
            label: 'Ocupação'
          },
          {
            Icon: TimerIcon,
            value: dashboardStatusData?.averageTime
              ? timeFormatter(dashboardStatusData.averageTime)
              : undefined,
            label: 'Tempo médio'
          },
          {
            Icon: BombIcon,
            value: dashboardStatusData?.highRisk
              ? masks(dashboardStatusData?.highRisk, 'number')
              : undefined,
            label: 'Risco alto'
          }
        ]
      case UserLevels.DOCTOR:
        return [
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.waitingPatients,
            label: 'Pacientes aguardando atendimento'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.attended,
            label: 'Atendimentos realizados'
          },
          {
            Icon: TimerIcon,
            value: dashboardStatusData?.averageTime
              ? timeFormatter(dashboardStatusData.averageTime)
              : undefined,
            label: 'Tempo médio de atendimento'
          },
          {
            Icon: UsersThreeIcon,
            value: dashboardStatusData?.assertiveness
              ? `${dashboardStatusData?.assertiveness}%`
              : 'n/a',
            label: 'Assertividade IA vs Médico(a)'
          }
        ]
      case UserLevels.NURSE:
        return [
          {
            Icon: HourglassIcon,
            value: dashboardStatusData?.waitingPatients,
            label: 'Pacientes aguardando triagem'
          },
          {
            Icon: CheckCircleIcon,
            value: dashboardStatusData?.triagedPatients,
            label: 'Pacientes triados'
          },
          {
            Icon: TimerIcon,
            value: dashboardStatusData?.averageTime
              ? timeFormatter(dashboardStatusData.averageTime)
              : undefined,
            label: 'Tempo médio de triagem'
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
            <AttendanceByTimeChart
              selectedPeriod={selectedPeriod}
              reload={reload}
            />
            <AttendanceQueueChart reload={reload} />
          </>
        )
      case UserLevels.DOCTOR:
        return <AttendanceQueueChart reload={reload} />
      case UserLevels.NURSE:
        return <AttendanceQueueChart reload={reload} />
      case UserLevels.PATIENT:
        return (
          <>
            <Button onClick={() => navigate(ROUTES.PRE_REGISTRATION.path)}>
              Clique para iniciar uma nova consulta
            </Button>
          </>
        )
      default:
        return <></>
    }
  }, [user?.level, navigate, selectedPeriod, reload])

  return (
    <>
      <AuthLayoutHeader
        actionComponent={
          <Flex align='center' gap={8}>
            {shouldShowPeriodSelect && (
              <InputSelect
                className={styles.periodSelect}
                placeholder='Período'
                options={Object.entries(PeriodsLabels).map(([key, value]) => ({
                  label: value,
                  value: key
                }))}
                inputHeight='2rem'
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
            )}
            <ReloadButton onReload={onReload} />
          </Flex>
        }
      />

      <div className={`${styles.container} ${styles[user?.level ?? '']}`}>
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
