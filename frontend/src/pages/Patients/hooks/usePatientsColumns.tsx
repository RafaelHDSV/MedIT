import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import { handleApiError } from '@/helpers/handleApiError'
import type { BloodType, IPatient } from '@/interfaces/IPatient'
import PatientsRepository from '@/repositories/PatientsRepository'
import { ROUTES } from '@/routes/constants'
import { DropIcon } from '@phosphor-icons/react'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

interface IUsePatientsColumnsProps {
  setEditingPatient: (patient: IPatient | null) => void
  setEditModalOpen: (isOpen: boolean) => void
  fetchPatients: () => Promise<void>
}

export function usePatientsColumns({
  setEditingPatient,
  setEditModalOpen,
  fetchPatients
}: IUsePatientsColumnsProps) {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (_id: ObjectId | undefined) => {
      if (!_id) return
      navigate(ROUTES.PATIENTS_DETAILS.path.replace(':id', _id.toString()))
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (patient: IPatient) => {
      setEditingPatient(patient)
      setEditModalOpen(true)
    },
    [setEditingPatient, setEditModalOpen]
  )

  const handleDelete = useCallback(
    async (patient: IPatient) => {
      Modal.confirm({
        title: `Deseja deletar o ${patient?.name ?? 'paciente'}?`,
        content: `Esta ação não pode ser desfeita.`,
        okText: 'Sim, deletar',
        cancelText: 'Cancelar',
        okButtonProps: { danger: true },
        async onOk() {
          try {
            await PatientsRepository.deletePatient({ patientId: patient._id })
            message.success('Paciente deletado com sucesso!')
            fetchPatients()
          } catch (err) {
            handleApiError({ err, defaultMessage: 'Erro ao deletar paciente' })
          }
        }
      })
    },
    [fetchPatients]
  )

  const commonColumns = getCommonColumns<IPatient>({
    handleNavigateToDetails,
    handleEdit,
    handleDelete
  })

  const columns: ColumnsType<IPatient> = useMemo(
    () => [
      commonColumns.id(),
      commonColumns.name({}),
      commonColumns.cpf(),
      commonColumns.email(),
      commonColumns.birthDate(),
      commonColumns.cellphone(),
      {
        title: <TooltipColumn text='Peso' />,
        dataIndex: 'weight',
        key: 'weight',
        width: 80,
        ellipsis: true,
        render: (weight: number) => (
          <TooltipColumn text={`${weight?.toString()} kg`} />
        )
      },
      {
        title: <TooltipColumn text='Altura' />,
        dataIndex: 'height',
        key: 'height',
        width: 80,
        ellipsis: true,
        render: (height: number) => (
          <TooltipColumn text={`${height?.toString()} m`} />
        )
      },
      {
        title: <TooltipColumn text='Tipo sanguíneo' icon={DropIcon} />,
        dataIndex: 'bloodType',
        key: 'bloodType',
        width: 60,
        ellipsis: true,
        render: (bloodType: BloodType) => <TooltipColumn text={bloodType} />
      },
      {
        title: <TooltipColumn text='Condições' />,
        dataIndex: 'conditions',
        key: 'conditions',
        width: 250,
        ellipsis: true,
        render: (conditions: string[]) => (
          <TooltipColumn text={conditions.join(', ')} />
        )
      },
      {
        title: <TooltipColumn text='Alergias' />,
        dataIndex: 'allergies',
        key: 'allergies',
        width: 250,
        ellipsis: true,
        render: (allergies: string[]) => (
          <TooltipColumn text={allergies.join(', ')} />
        )
      },
      commonColumns.createdAt(),
      commonColumns.updatedAt(),
      commonColumns.actions()
    ],
    [commonColumns]
  )

  return columns
}
