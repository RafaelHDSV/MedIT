import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import { handleApiError } from '@/helpers/handleApiError'
import type { IDoctor } from '@/interfaces/IDoctor'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import { ROUTES } from '@/routes/constants'
import masks from '@/utils/masks'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TooltipColumn from '../../../components/ListTable/components/TooltipColumn/TooltipColumn'

interface IUseDoctorsColumnsProps {
  setEditingDoctor: (doctor: IDoctor | null) => void
  setEditModalOpen: (isOpen: boolean) => void
  fetchDoctors: () => Promise<void>
}

export function useDoctorsColumns({
  setEditingDoctor,
  setEditModalOpen,
  fetchDoctors
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

  const handleDelete = useCallback(
    async (doctor: IDoctor) => {
      Modal.confirm({
        title: 'Deseja deletar este médico(a)?',
        content: `Esta ação não pode ser desfeita.`,
        okText: 'Sim, deletar',
        cancelText: 'Cancelar',
        okButtonProps: { danger: true },
        async onOk() {
          try {
            await DoctorsRepository.deleteDoctor({ doctorId: doctor._id })
            message.success('Médico(a) deletado com sucesso!')
            fetchDoctors()
          } catch (err) {
            handleApiError({ err, defaultMessage: 'Erro ao deletar médico(a)' })
          }
        }
      })
    },
    [fetchDoctors]
  )

  const commonColumns = getCommonColumns<IDoctor>({
    handleNavigateToDetails,
    handleEdit,
    handleDelete
  })

  const columns: ColumnsType<IDoctor> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name(),
      commonColumns.cpf(),
      commonColumns.email(),
      commonColumns.birthDate(),
      commonColumns.cellphone(),
      {
        title: 'CRM',
        dataIndex: 'crm',
        key: 'crm',
        width: 120,
        ellipsis: true,
        render: (crm: string) => <TooltipColumn text={masks(crm, 'crm')} />
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt(),
      commonColumns.actions()
    ],
    [commonColumns]
  )

  return columns
}
