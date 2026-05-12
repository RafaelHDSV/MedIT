import TooltipColumn from '@/components/ListTable/components/TooltipColumn/TooltipColumn'
import { getCommonColumns } from '@/components/ListTable/hooks/useCommonColumns'
import { handleApiError } from '@/helpers/handleApiError'
import type { BloodType, IPatient } from '@/interfaces/IPatient'
import PatientsRepository from '@/repositories/PatientsRepository'
import { ROUTES } from '@/routes/constants'
import { sorterFunctionByNumber } from '@/utils/sorterFunction'
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
  readOnly?: boolean
  unitNameById?: Map<string, string>
}

export function usePatientsColumns({
  setEditingPatient,
  setEditModalOpen,
  fetchPatients,
  readOnly = false,
  unitNameById
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
        title: `Deseja deletar ${patient?.name ?? 'o paciente'}?`,
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
    handleEdit: readOnly ? undefined : handleEdit,
    handleDelete: readOnly ? undefined : handleDelete
  })

  const columns: ColumnsType<IPatient> = useMemo(() => {
    const cols: ColumnsType<IPatient> = [
      commonColumns.id(),
      commonColumns.name({})
    ]

    if (unitNameById) {
      cols.push({
        title: 'Unidade',
        key: 'unitId',
        width: 160,
        ellipsis: true,
        render: (_: unknown, r: IPatient) => (
          <TooltipColumn
            text={
              r.unitId
                ? (unitNameById.get(String(r.unitId)) ?? String(r.unitId))
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
        title: <TooltipColumn text='Peso' />,
        dataIndex: 'weight',
        key: 'weight',
        width: 80,
        ellipsis: true,
        sorter: sorterFunctionByNumber('weight'),
        render: (weight: number) => (
          <TooltipColumn
            text={weight ? `${weight?.toString()} kg` : undefined}
          />
        )
      },
      {
        title: <TooltipColumn text='Altura' />,
        dataIndex: 'height',
        key: 'height',
        width: 80,
        ellipsis: true,
        sorter: sorterFunctionByNumber('height'),
        render: (height: number) => (
          <TooltipColumn
            text={height ? `${height?.toString()} m` : undefined}
          />
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
          <TooltipColumn
            text={conditions ? conditions.join(', ') : undefined}
          />
        )
      },
      {
        title: <TooltipColumn text='Alergias' />,
        dataIndex: 'allergies',
        key: 'allergies',
        width: 250,
        ellipsis: true,
        render: (allergies: string[]) => (
          <TooltipColumn text={allergies ? allergies.join(', ') : undefined} />
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
