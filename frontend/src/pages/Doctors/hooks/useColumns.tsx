import { ROUTES } from '@/routes/constants'
import masks from '@/utils/masks'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IDoctorList } from '../Doctors'

export function useDoctorsColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: string) => {
      navigate(ROUTES.DOCTORS_DETAILS.path.replace(':id', id))
    },
    [navigate]
  )

  const columns: ColumnsType<IDoctorList> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id'
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
        title: 'CPF',
        dataIndex: 'cpf',
        key: 'cpf',
        render: (cpf: string) => masks(cpf, 'cpf')
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Data de Nascimento',
        dataIndex: 'birthDate',
        key: 'birthDate',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY')
      },
      {
        title: 'Telefone',
        dataIndex: 'cellphone',
        key: 'cellphone',
        render: (cellphone: string) => masks(cellphone, 'cellphone')
      },
      {
        title: 'CRM',
        dataIndex: 'crm',
        key: 'crm'
      }
    ],
    [handleNavigateToDetails]
  )

  return columns
}
