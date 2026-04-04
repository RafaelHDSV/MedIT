import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
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

  // VIEIRA: Desenvolver a funcionalidade da assertividade da IA
  const assertivenessIA = true

  const columns: ColumnsType<IAttendance> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name(),
      commonColumns.birthDate(),
      {
        title: 'Queixa',
        dataIndex: 'complaint',
        key: 'complaint',
        width: 140,
        ellipsis: true,
        render: (text: string) => <TooltipColumn text={text} />
      },
      {
        title: 'Atendido em',
        dataIndex: 'date',
        key: 'date',
        width: 180,
        ellipsis: true,
        render: (date: Date | string) => (
          <TooltipColumn
            text={`${dayjs(date).format('DD/MM/YYYY')} às ${dayjs(date).format('HH:mm')}  `}
          />
        )
      },
      {
        title: 'Risco',
        dataIndex: 'risk',
        key: 'risk',
        width: 160,
        ellipsis: true,
        render: (risk: string) => <RiskTag risk={risk as AttendanceRisk} />
      },
      {
        title: 'Diagnóstico',
        dataIndex: 'diagnosis',
        key: 'diagnosis',
        width: 120,
        ellipsis: true,
        render: (text: string) => (
          <TooltipColumn text={`${text} ${assertivenessIA && '✅'}`} />
        )
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt()
    ],
    [commonColumns, assertivenessIA]
  )

  return columns
}
