import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import { handleApiError } from '@/helpers/handleApiError'
import type { IBaseUser } from '@/interfaces/IUser'
import UserRepository from '@/repositories/UserRepository'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useMemo } from 'react'

type AdminRow = IBaseUser & { _id: string; unitId?: string }

interface Props {
  setEditingAdmin: (admin: AdminRow | null) => void
  setEditModalOpen: (open: boolean) => void
  fetchAdmins: () => Promise<void>
  unitNameById: Map<string, string>
}

export function useAdminColumns({
  setEditingAdmin,
  setEditModalOpen,
  fetchAdmins,
  unitNameById
}: Props) {
  const handleEdit = useCallback(
    (admin: AdminRow) => {
      setEditingAdmin(admin)
      setEditModalOpen(true)
    },
    [setEditingAdmin, setEditModalOpen]
  )

  const handleDelete = useCallback(
    async (admin: AdminRow) => {
      Modal.confirm({
        title: `Deseja deletar ${admin.name ?? 'o administrador'}?`,
        content: 'Esta ação não pode ser desfeita.',
        okText: 'Sim, deletar',
        cancelText: 'Cancelar',
        okButtonProps: { danger: true },
        async onOk() {
          try {
            await UserRepository.deleteAdmin({ adminId: String(admin._id) })
            message.success('Administrador removido com sucesso!')
            fetchAdmins()
          } catch (err) {
            handleApiError({
              err,
              defaultMessage: 'Erro ao remover administrador'
            })
          }
        }
      })
    },
    [fetchAdmins]
  )

  const commonColumns = getCommonColumns<AdminRow>({
    handleNavigateToDetails: () => {},
    handleEdit,
    handleDelete
  })

  const columns: ColumnsType<AdminRow> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name({ canGoToDetails: false }),
      commonColumns.cpf(),
      commonColumns.email(),
      commonColumns.cellphone(),
      {
        title: 'Unidade',
        key: 'unitId',
        width: 160,
        ellipsis: true,
        render: (_: unknown, r: AdminRow) => (
          <TooltipColumn
            text={
              r.unitId
                ? unitNameById.get(String(r.unitId)) ?? String(r.unitId)
                : undefined
            }
          />
        )
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt(),
      commonColumns.actions()
    ],
    [commonColumns, unitNameById]
  )

  return columns
}
