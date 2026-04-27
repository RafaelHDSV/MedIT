import DetailsLine from '@/components/DetailsLine/DetailsLine'
import Button from '@/components/Button/Button'
import Tag from '@/components/Tag/Tag'
import { useAuth } from '@/hooks/useAuth'
import {
  MedicationAvailabilityStatusLabels,
  MedicationCategoriesLabels,
  type IMedication
} from '@/interfaces/IMedication'
import MedicationModel from '@/models/MedicationModel'
import masks from '@/utils/masks'
import { Modal } from 'antd'
import { MEDICATIONS_STATUS_MAP } from '../../medicationsConstants'
import styles from './MedicationDetailsModal.module.scss'

function PrescriptionAlert({
  requiresPrescription
}: {
  requiresPrescription: boolean
}) {
  return (
    <div
      className={`${styles.prescriptionAlert} ${requiresPrescription ? styles.requiresPrescription : styles.notRequiresPrescription}`}
    >
      {requiresPrescription ? (
        <span>⚠️ Venda sob prescrição médica</span>
      ) : (
        <span>✅ Medicamento de livre acesso</span>
      )}
    </div>
  )
}

interface IMedicationDetailsModal {
  selectedMedication?: IMedication
  setSelectedMedication?: (medication?: IMedication) => void
  onEditMedication?: (medication: IMedication) => void
}

function MedicationDetailsModal({
  selectedMedication,
  setSelectedMedication,
  onEditMedication
}: IMedicationDetailsModal) {
  const { user } = useAuth()
  const canSeeUnits = MedicationModel.canSeeUnits(user?.level)
  const canEditMedication = MedicationModel.canEditMedication(user?.level)
  const isOpen = Boolean(selectedMedication)

  function resetMedication() {
    setSelectedMedication?.(undefined)
  }

  if (!selectedMedication) return
  const {
    name,
    requiresPrescription,
    description,
    category,
    availabilityStatus,
    stockQuantity,
    unitId
  } = selectedMedication
  const canEditSelectedMedication =
    canEditMedication && String(user?.unitId) === String(unitId)

  return (
    <Modal
      className={styles.modal}
      open={isOpen}
      onCancel={resetMedication}
      footer={null}
      centered
    >
      <h2>Detalhes de {name}</h2>

      <div className={styles.content}>
        <PrescriptionAlert requiresPrescription={requiresPrescription} />

        <DetailsLine label='Nome' value={name} />
        <DetailsLine label='Descrição' value={description} />
        <DetailsLine
          label='Categoria'
          value={MedicationCategoriesLabels[category]}
        />
        <DetailsLine
          label='Status'
          value={
            <Tag
              status={MEDICATIONS_STATUS_MAP[availabilityStatus]}
              fontSize={12}
            >
              {MedicationAvailabilityStatusLabels[availabilityStatus]}
            </Tag>
          }
        />
        {canSeeUnits && (
          <DetailsLine
            label='Estoque'
            value={
              stockQuantity === 0
                ? 'Sem medicamentos'
                : `${masks(stockQuantity, 'number')} unidade${stockQuantity > 1 ? 's' : ''}`
            }
          />
        )}

        {canEditSelectedMedication && (
          <Button
            className='w-100 mt-1'
            onClick={() => onEditMedication?.(selectedMedication)}
          >
            Editar medicamento
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default MedicationDetailsModal
