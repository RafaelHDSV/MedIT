import RiskTag from '@/components/RiskTag/RiskTag'
import type { AttendanceRisk, IAttendance } from '@/interfaces/IAttendance'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'

export function useAttendancesColumns() {
  // const navigate = useNavigate()

  // VIEIRA: Implementar navegação para detalhes do atendimento
  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      // navigate(ROUTES.ATTENDANCES_DETAILS.path.replace(':id', id.toString()))
    },
    [
      // navigate
    ]
  )

  const columns: ColumnsType<IAttendance> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record) => (
          <span
            role='button'
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavigateToDetails(record._id)}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleNavigateToDetails(record._id)
            }
          >
            {name}
          </span>
        )
      },
      {
        title: 'Data de Nascimento',
        dataIndex: 'birthDate',
        key: 'birthDate',
        render: (date: Date | string) =>
          `${dayjs(date).format('DD/MM/YYYY')} (${getAgeByBirthDate(date)} anos)`
      },
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
      {
        title: 'Criado em',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Atualizado em',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY HH:mm')
      }
    ],
    [handleNavigateToDetails]
  )

  return columns
}
