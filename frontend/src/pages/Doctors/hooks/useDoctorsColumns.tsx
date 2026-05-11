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
  readOnly?: boolean
  unitNameById?: Map<string, string>
}

export function useDoctorsColumns({
  setEditingDoctor,
  setEditModalOpen,
  fetchDoctors,
  readOnly = false,
  unitNameById
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
        title: `Deseja deletar ${doctor.name ?? 'o médico(a)'}?`,
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
    handleEdit: readOnly ? undefined : handleEdit,
    handleDelete: readOnly ? undefined : handleDelete
  })

  const columns: ColumnsType<IDoctor> = useMemo(() => {
    const cols: ColumnsType<IDoctor> = [
      commonColumns.id(),
      commonColumns.name({})
    ]

    if (unitNameById) {
      cols.push({
        title: 'Unidade',
        key: 'unitId',
        width: 160,
        ellipsis: true,
        render: (_: unknown, r: IDoctor) => (
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
        title: 'CRM',
        dataIndex: 'crm',
        key: 'crm',
        width: 120,
        ellipsis: true,
        render: (crm: string) => (
          <TooltipColumn text={crm ? masks(crm, 'crm') : undefined} />
        )
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
