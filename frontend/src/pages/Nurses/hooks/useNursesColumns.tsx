import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import type { IError } from '@/interfaces/IError'
import type { INurse } from '@/interfaces/INurse'
import NursesRepository from '@/repositories/NursesRepository'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios, { AxiosError } from 'axios'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface IUseNursesColumnsProps {
  setEditingNurse: (nurse: INurse | null) => void
  setEditModalOpen: (isOpen: boolean) => void
  fetchNurses: () => Promise<void>
}

export function useNursesColumns({
  setEditingNurse,
  setEditModalOpen,
  fetchNurses
}: IUseNursesColumnsProps) {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (_id: ObjectId | undefined) => {
      if (!_id) return
      navigate(ROUTES.NURSES_DETAILS.path.replace(':id', _id.toString()))
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (nurse: INurse) => {
      setEditingNurse(nurse)
      setEditModalOpen(true)
    },
    [setEditingNurse, setEditModalOpen]
  )

  const handleDelete = useCallback(
    async (nurse: INurse) => {
      Modal.confirm({
        title: 'Deseja deletar este enfermeiro(a)?',
        content: `Esta ação não pode ser desfeita.`,
        okText: 'Sim, deletar',
        cancelText: 'Cancelar',
        okButtonProps: { danger: true },
        async onOk() {
          try {
            await NursesRepository.deleteNurse({ nurseId: nurse._id })
            message.success('Enfermeiro(a) deletado com sucesso!')
            fetchNurses()
          } catch (err) {
            if (!axios.isAxiosError(err)) return
            const error = err as AxiosError<IError>
            message.error(
              error.response?.data?.message ?? 'Erro ao deletar enfermeiro(a)'
            )
          }
        }
      })
    },
    [fetchNurses]
  )

  const commonColumns = getCommonColumns<INurse>({
    handleNavigateToDetails,
    handleEdit,
    handleDelete
  })

  const columns: ColumnsType<INurse> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name(),
      commonColumns.cpf(),
      commonColumns.email(),
      commonColumns.birthDate(),
      commonColumns.cellphone(),
      {
        title: 'COREN',
        dataIndex: 'coren',
        key: 'coren',
        width: 180,
        ellipsis: true,
        render: (coren: string) => <TooltipColumn text={coren} />
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt(),
      commonColumns.actions()
    ],
    [commonColumns]
  )

  return columns
}
