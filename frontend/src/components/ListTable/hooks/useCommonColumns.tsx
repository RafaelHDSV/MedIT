import Button from '@/components/Button/Button'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  sorterFunctionByDate,
  sorterFunctionById
} from '@/utils/sorterFunction'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Flex, Tooltip } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import TooltipColumn from '../components/TooltipColumn/TooltipColumn'
import styles from '../ListTable.module.scss'

interface IGetCommonColumnsProps<K> {
  handleNavigateToDetails: (id: ObjectId | undefined) => void
  handleEdit?: (entity: K) => void
  handleDelete?: (entity: K) => void
}

export function getCommonColumns<K extends { _id?: ObjectId }>({
  handleNavigateToDetails,
  handleEdit,
  handleDelete
}: IGetCommonColumnsProps<K>) {
  return {
    id: (): ColumnType<K> => ({
      title: 'ID',
      dataIndex: 'number',
      key: 'number',
      width: 60,
      sorter: sorterFunctionById,
      render: (_id: string) => <TooltipColumn text={_id} />
    }),
    name: ({
      canGoToDetails = true
    }: {
      canGoToDetails?: boolean
    }): ColumnType<K> => ({
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
      render: (name: string, record: K) => {
        return canGoToDetails ? (
          name ? (
            <span
              role='button'
              tabIndex={0}
              className={`${styles.clickableItem ?? ''} ellipsis`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigateToDetails(record?._id)}
            >
              <TooltipColumn text={name} />
            </span>
          ) : (
            'n/a'
          )
        ) : (
          <TooltipColumn text={name} />
        )
      }
    }),
    cpf: (): ColumnType<K> => ({
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      width: 140,
      ellipsis: true,
      render: (cpf: string) => (
        <TooltipColumn text={cpf ? masks(cpf, 'cpf') : undefined} />
      )
    }),
    email: (): ColumnType<K> => ({
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      ellipsis: true,
      render: (email: string) => <TooltipColumn text={email} />
    }),
    birthDate: (): ColumnType<K> => ({
      title: 'Data de Nascimento',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: 180,
      ellipsis: true,
      sorter: sorterFunctionByDate('birthDate'),
      render: (date: Date | string) => (
        <TooltipColumn
          text={
            date
              ? `${dayjs(date).format('DD/MM/YYYY')} (${getAgeByBirthDate(date)} anos)`
              : undefined
          }
        />
      )
    }),
    cellphone: (): ColumnType<K> => ({
      title: 'Telefone',
      dataIndex: 'cellphone',
      key: 'cellphone',
      width: 140,
      ellipsis: true,
      render: (cellphone: string) => (
        <TooltipColumn
          text={cellphone ? masks(cellphone, 'cellphone') : undefined}
        />
      )
    }),
    createdAt: (): ColumnType<K> => ({
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      ellipsis: true,
      sorter: sorterFunctionByDate('createdAt'),
      render: (date: Date | string) => (
        <TooltipColumn
          text={date ? dayjs(date).format('DD/MM/YYYY HH:mm') : undefined}
        />
      )
    }),
    updatedAt: (): ColumnType<K> => ({
      title: 'Atualizado em',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      ellipsis: true,
      sorter: sorterFunctionByDate('updatedAt'),
      render: (date: Date | string) => (
        <TooltipColumn
          text={date ? dayjs(date).format('DD/MM/YYYY HH:mm') : undefined}
        />
      )
    }),
    actions: (): ColumnType<K> => ({
      title: 'Ações',
      key: 'actions',
      width: 100,
      render: (_action: string, record: K) => (
        <Flex gap={8}>
          <Tooltip title='Editar'>
            <Button
              mode='icon'
              onClick={() => handleEdit?.(record)}
              aria-label='Editar médico(a)'
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title='Deletar'>
            <Button
              mode='icon'
              onClick={() => handleDelete?.(record)}
              aria-label='Deletar médico(a)'
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Flex>
      )
    })
  }
}
