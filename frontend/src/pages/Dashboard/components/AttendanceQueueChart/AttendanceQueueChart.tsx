import DashboardCard from '@/components/DashboardCard/DashboardCard'
import Empty from '@/components/Empty/Empty'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { Periods } from '@/interfaces/globals'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import { UserLevels } from '@/interfaces/IUser'
import DashboardRepository from '@/repositories/DashboardRepository'
import { StethoscopeIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import styles from './AttendanceQueueChart.module.scss'
import AttendanceQueueChartAdmin from './components/AttendanceQueueChartAdmin/AttendanceQueueChartAdmin'
import AttendanceQueueChartDoctor from './components/AttendanceQueueChartDoctor/AttendanceQueueChartDoctor'
import AttendanceQueueChartNurse from './components/AttendanceQueueChartNurse/AttendanceQueueChartNurse'

export interface IAttendanceItemProps {
  item?: IDashboardQueueItem
  loading?: boolean
}

function AttendanceItem({ item, loading }: IAttendanceItemProps) {
  const { user } = useAuth()

  switch (user?.level) {
    case 'medit':
    case 'admin':
      return <AttendanceQueueChartAdmin item={item} loading={loading} />
    case 'doctor':
      return <AttendanceQueueChartDoctor item={item} loading={loading} />
    case 'nurse':
      return <AttendanceQueueChartNurse item={item} loading={loading} />
    default:
      return <></>
  }
}

interface IAttendanceQueueChartProps {
  reload: boolean
  selectedPeriod?: Periods
  referenceDate?: string
}

function AttendanceQueueChart({
  reload,
  selectedPeriod,
  referenceDate
}: IAttendanceQueueChartProps) {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        const params: {
          period?: Periods
          referenceDate?: string
          level?: UserLevels
          unitId?: string
        } = {
          level: user?.level
        }
        if (user?.unitId) {
          params.unitId = String(user.unitId)
        }
        if (selectedPeriod !== undefined) params.period = selectedPeriod
        if (referenceDate !== undefined) params.referenceDate = referenceDate

        const response = await DashboardRepository.getAttendanceQueue({
          params
        })
        const data = response.data
        setData(data)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Erro ao pegar fila de atendimento'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.unitId, user?.level, reload, selectedPeriod, referenceDate])

  const cardConfig = useMemo(() => {
    switch (user?.level) {
      case 'nurse':
        return {
          title: 'Fila de Triagem',
          asideText: data?.length > 1 ? 'triagens' : 'triagem'
        }
      default:
        return {
          title: 'Fila de Atendimento',
          asideText: data?.length > 1 ? 'atendimentos' : 'atendimento'
        }
    }
  }, [user?.level, data?.length])

  const content = useMemo(() => {
    const isNurse = user?.level === UserLevels.NURSE

    if (loading) {
      return Array.from({ length: 8 }).map((_, i) => (
        <AttendanceItem key={i} loading={loading} />
      ))
    }

    if (data.length === 0)
      return (
        <Empty
          message={`Nenhum(a) ${isNurse ? 'triagem' : 'atendimento'} encontrado(a)`}
        />
      )

    return data.map((item) => (
      <AttendanceItem key={String(item._id)} item={item} />
    ))
  }, [loading, data, user?.level])

  return (
    <DashboardCard
      title={cardConfig.title}
      icon={StethoscopeIcon}
      asideText={`${data?.length} ${cardConfig.asideText}`}
      gridArea='attendanceQueueChart'
    >
      <div className={styles.queueList}>{content}</div>
    </DashboardCard>
  )
}

export default AttendanceQueueChart
