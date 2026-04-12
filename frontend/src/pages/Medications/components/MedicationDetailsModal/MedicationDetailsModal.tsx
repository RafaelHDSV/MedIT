import {
  MedicationAvailabilityStatusLabels,
  type IMedication
} from '@/interfaces/IMedication'
import { Modal } from 'antd'

interface IMedicationDetailsModal {
  selectedMedication?: IMedication
  setSelectedMedication?: (medication?: IMedication) => void
}

function MedicationDetailsModal({
  selectedMedication,
  setSelectedMedication
}: IMedicationDetailsModal) {
  const isOpen = Boolean(selectedMedication)

  function resetMedication() {
    setSelectedMedication?.(undefined)
  }

  if (!selectedMedication) return

  return (
    <Modal
      title='Detalhes do Medicamento'
      open={isOpen}
      onCancel={resetMedication}
      footer={null}
      centered
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: selectedMedication.requiresPrescription
              ? '#fff1f0'
              : '#f6ffed',
            border: `1px solid ${selectedMedication.requiresPrescription ? '#ffa39e' : '#b7eb8f'}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500,
            color: selectedMedication.requiresPrescription
              ? '#cf1322'
              : '#389e0d'
          }}
        >
          <span style={{ fontSize: '18px' }}>
            {selectedMedication.requiresPrescription ? '⚠️' : '✅'}
          </span>
          {selectedMedication.requiresPrescription
            ? 'Venda sob prescrição médica.'
            : 'Medicamento de livre acesso / venda livre.'}
        </div>

        <div>
          <strong>Nome:</strong> {selectedMedication.name}
        </div>
        <div>
          <strong>Categoria:</strong> {selectedMedication.category}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {
            MedicationAvailabilityStatusLabels[
              selectedMedication.availabilityStatus
            ]
          }
        </div>
        <div>
          <strong>Estoque:</strong> {selectedMedication.stockQuantity} unidades
        </div>
        <div>
          <strong>Descrição:</strong>
          <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>
            {selectedMedication.description || 'Nenhuma descrição disponível.'}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default MedicationDetailsModal
