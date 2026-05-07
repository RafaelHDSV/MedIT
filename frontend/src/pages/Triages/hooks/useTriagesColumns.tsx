import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import type { AttendanceRisk, IAttendance } from '@/interfaces/IAttendance'
import { ROUTES } from '@/routes/constants'
import { formatDate } from '@/utils/formatDate'
import { sorterFunctionByDate } from '@/utils/sorterFunction'
import type { ColumnsType } from 'antd/es/table'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function useTriagesColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      navigate(
        ROUTES.TRIAGES_DETAILS.path.replace(':attendanceId', id.toString())
      )
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
        dataIndex: 'triagedAt',
        key: 'triagedAt',
        width: 180,
        ellipsis: true,
        sorter: sorterFunctionByDate('triagedAt'),
        render: (triagedAt: Date | string, attendance: IAttendance) => (
          <TooltipColumn
            text={
              (triagedAt ?? attendance.date)
                ? formatDate({
                    date: triagedAt ?? attendance.date,
                    mode: 'datetimeWithAt'
                  })
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
