import { api } from '@/api/api'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { IError } from '@/interfaces/IError'
import { ROUTES } from '@/routes/constants'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Flex, message, Modal, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { AxiosError } from 'axios'
import axios from 'axios'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TooltipColumn from '../components/TooltipColumn/TooltipColumn'

interface IUseDoctorsColumnsProps {
  setEditingDoctor: (doctor: IDoctor | null) => void
  setEditModalOpen: (isOpen: boolean) => void
}

export function useDoctorsColumns({
  setEditingDoctor,
  setEditModalOpen
}: IUseDoctorsColumnsProps) {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (_id: ObjectId | undefined) => {
      if (!_id) return
      navigate(ROUTES.DOCTORS_DETAILS.path.replace(':id', _id.toString()))
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (doctor: IDoctor) => {
      setEditingDoctor(doctor)
      setEditModalOpen(true)
    },
    [setEditingDoctor, setEditModalOpen]
  )

  const handleDelete = useCallback(async (doctor: IDoctor) => {
    Modal.confirm({
      title: 'Deseja deletar este médico?',
      content: `Esta ação não pode ser desfeita.`,
      okText: 'Sim, deletar',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await api.delete(`/doctors/${doctor._id}`)
          message.success('Médico deletado com sucesso!')
          window.location.reload()
        } catch (err) {
          if (!axios.isAxiosError(err)) return
          const error = err as AxiosError<IError>
          message.error(
            error.response?.data?.message ?? 'Erro ao deletar médico'
          )
        }
      }
    })
  }, [])

  const columns: ColumnsType<IDoctor> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number',
        width: 60
      },
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        width: 180,
        ellipsis: true,
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
            <TooltipColumn text={name} />
          </span>
        )
      },
      {
        title: 'CPF',
        dataIndex: 'cpf',
        key: 'cpf',
        width: 140,
        render: (cpf: string) => <TooltipColumn text={masks(cpf, 'cpf')} />
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email',
        width: 220,
        render: (email: string) => <TooltipColumn text={email} />
      },
      {
        title: 'Data de Nascimento',
        dataIndex: 'birthDate',
        key: 'birthDate',
        width: 180,
        render: (date: Date | string) => (
          <TooltipColumn
            text={`${dayjs(date).format('DD/MM/YYYY')} (${getAgeByBirthDate(date)} anos)`}
          />
        )
      },
      {
        title: 'Telefone',
        dataIndex: 'cellphone',
        key: 'cellphone',
        width: 140,
        render: (cellphone: string) => (
          <TooltipColumn text={masks(cellphone, 'cellphone')} />
        )
      },
      {
        title: 'CRM',
        dataIndex: 'crm',
        key: 'crm',
        width: 120,
        render: (crm: string) => <TooltipColumn text={masks(crm, 'crm')} />
      },
      {
        title: 'Criado em',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 160,
        render: (date: Date | string) => (
          <TooltipColumn text={dayjs(date).format('DD/MM/YYYY HH:mm')} />
        )
      },
      {
        title: 'Atualizado em',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 160,
        render: (date: Date | string) => (
          <TooltipColumn text={dayjs(date).format('DD/MM/YYYY HH:mm')} />
        )
      },
      {
        title: 'Ações',
        key: '',
        width: 100,
        render: (_, record: IDoctor) => (
          <Flex gap={8}>
            <Tooltip title='Editar'>
              <div
                style={{ padding: 0 }}
                onClick={() => handleEdit(record)}
                aria-label='Editar médico'
              >
                <EditOutlined />
              </div>
            </Tooltip>

            <Tooltip title='Deletar'>
              <div
                style={{ padding: 0 }}
                onClick={() => handleDelete(record)}
                aria-label='Deletar médico'
              >
                <DeleteOutlined />
              </div>
            </Tooltip>
          </Flex>
        )
      }
    ],
    [handleNavigateToDetails, handleEdit, handleDelete]
  )

  return columns
}
