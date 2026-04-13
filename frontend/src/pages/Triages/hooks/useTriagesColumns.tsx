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

export function useTriagesColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      navigate(ROUTES.TRIAGES_DETAILS.path.replace(':id', id.toString()))
    },
    [navigate]
  )

  const commonColumns = getCommonColumns<IAttendance>({
    handleNavigateToDetails
  })

  const columns: ColumnsType<IAttendance> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name({}),
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
        title: 'Triado em',
        dataIndex: 'date',
        key: 'date',
        width: 180,
        ellipsis: true,
        render: (date: Date | string) => (
          <TooltipColumn
            text={
              date
                ? `${dayjs(date).format('DD/MM/YYYY')} às ${dayjs(date).format('HH:mm')}`
                : undefined
            }
          />
        )
      },
      {
        title: 'Risco',
        dataIndex: 'risk',
        key: 'risk',
        width: 160,
        ellipsis: true,
        render: (risk: string) =>
          risk ? <RiskTag risk={risk as AttendanceRisk} /> : 'n/a'
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt()
    ],
    [commonColumns]
  )

  return columns
}
