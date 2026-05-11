import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import { handleApiError } from '@/helpers/handleApiError'
import type { INurse } from '@/interfaces/INurse'
import NursesRepository from '@/repositories/NursesRepository'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface IUseNursesColumnsProps {
  setEditingNurse: (nurse: INurse | null) => void
  setEditModalOpen: (isOpen: boolean) => void
  fetchNurses: () => Promise<void>
  readOnly?: boolean
  unitNameById?: Map<string, string>
}

export function useNursesColumns({
  setEditingNurse,
  setEditModalOpen,
  fetchNurses,
  readOnly = false,
  unitNameById
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
        title: `Deseja deletar ${nurse?.name ?? 'o enfermeiro(a)'}?`,
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
            handleApiError({
              err,
              defaultMessage: 'Erro ao deletar enfermeiro(a)'
            })
          }
        }
      })
    },
    [fetchNurses]
  )

  const commonColumns = getCommonColumns<INurse>({
    handleNavigateToDetails,
    handleEdit: readOnly ? undefined : handleEdit,
    handleDelete: readOnly ? undefined : handleDelete
  })

  const columns: ColumnsType<INurse> = useMemo(() => {
    const cols: ColumnsType<INurse> = [
      commonColumns.id(),
      commonColumns.name({})
    ]

    if (unitNameById) {
      cols.push({
        title: 'Unidade',
        key: 'unitId',
        width: 160,
        ellipsis: true,
        render: (_: unknown, r: INurse) => (
          <TooltipColumn
            text={
              r.unitId
                ? unitNameById.get(String(r.unitId)) ?? String(r.unitId)
                : undefined
            }
          />
        )
      })
    }

    cols.push(
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
      commonColumns.updatedAt()
    )

    if (!readOnly) {
      cols.push(commonColumns.actions())
    }

    return cols
  }, [commonColumns, readOnly, unitNameById])

  return columns
}
