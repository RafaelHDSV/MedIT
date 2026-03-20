import type { IUser } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function usePatientsColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      navigate(ROUTES.PATIENTS_DETAILS.path.replace(':id', id.toString()))
    },
    [navigate]
  )

  const columns: ColumnsType<IUser> = useMemo(
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
        render: (date: Date | string) =>
          `${dayjs(date).format('DD/MM/YYYY')} (${getAgeByBirthDate(date)} anos)`
      },
      {
        title: 'Telefone',
        dataIndex: 'cellphone',
        key: 'cellphone',
        render: (cellphone: string) => masks(cellphone, 'cellphone')
      },
      {
        title: 'Tipo Sanguíneo',
        dataIndex: 'bloodType',
        key: 'bloodType'
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
