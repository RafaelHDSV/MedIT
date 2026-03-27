import { api } from '@/api/api'
import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import type { IError } from '@/interfaces/IError'
import type { BloodType, IPatient } from '@/interfaces/IPatient'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios, { AxiosError } from 'axios'
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
        title: 'Deseja deletar este paciente?',
        content: `Esta ação não pode ser desfeita.`,
        okText: 'Sim, deletar',
        cancelText: 'Cancelar',
        okButtonProps: { danger: true },
        async onOk() {
          try {
            await api.delete(`/patients/${patient._id}`)
            message.success('Paciente deletado com sucesso!')
            fetchPatients()
          } catch (err) {
            if (!axios.isAxiosError(err)) return
            const error = err as AxiosError<IError>
            message.error(
              error.response?.data?.message ?? 'Erro ao deletar paciente'
            )
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
      commonColumns.name(),
      commonColumns.cpf(),
      commonColumns.email(),
      commonColumns.birthDate(),
      commonColumns.cellphone(),
      {
        title: 'Peso',
        dataIndex: 'weight',
        key: 'weight',
        render: (weight: number) => <TooltipColumn text={weight?.toString()} />
      },
      {
        title: 'Altura',
        dataIndex: 'height',
        key: 'height',
        render: (height: number) => <TooltipColumn text={height?.toString()} />
      },
      {
        title: 'Tipo sanguíneo',
        dataIndex: 'bloodType',
        key: 'bloodType',
        render: (bloodType: BloodType) => <TooltipColumn text={bloodType} />
      },
      {
        title: 'Condições',
        dataIndex: 'conditions',
        key: 'conditions',
        render: (conditions: string[]) => (
          <TooltipColumn text={conditions.join(', ')} />
        )
      },
      {
        title: 'Alergias',
        dataIndex: 'allergies',
        key: 'allergies',
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
