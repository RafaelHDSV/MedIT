import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import RiskTag from '@/components/RiskTag/RiskTag'
import type { AttendanceRisk, IAttendance } from '@/interfaces/IAttendance'
import { ROUTES } from '@/routes/constants'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
export function useAttendancesColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      // VIEIRA: Implementar navegação para detalhes do atendimento
      navigate(ROUTES.ATTENDANCES.path.replace(':id', id.toString()))
    },
    [navigate]
  )

  const commonColumns = getCommonColumns<IAttendance>({
    handleNavigateToDetails
  })

  const columns: ColumnsType<IAttendance> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name(),
      commonColumns.birthDate(),
      {
        title: 'Queixa',
        dataIndex: 'complaint',
        key: 'complaint'
      },
      {
        title: 'Atendido em',
        dataIndex: 'date',
        key: 'date',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Risco',
        dataIndex: 'risk',
        key: 'risk',
        render: (risk: string) => <RiskTag risk={risk as AttendanceRisk} />
      },
      {
        title: 'Diagnóstico',
        dataIndex: 'diagnosis',
        key: 'diagnosis'
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt()
    ],
    [commonColumns]
  )

  return columns
}
