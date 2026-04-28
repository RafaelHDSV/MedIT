import Button from '@/components/Button/Button'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import SymptomTag from '@/components/SymptomTag/SymptomTag'
import {
  type AttendanceRisk,
  type VitalFieldDraft
} from '@/interfaces/IAttendance'
import masks from '@/utils/masks'
import { Flex, Modal } from 'antd'
import styles from './ConfirmTriageModal.module.scss'

interface IConfirmTriageModalProps {
  open: boolean
  loading: boolean
  risk?: AttendanceRisk
  symptoms: string[]
  symptomLabelByKey: Record<string, string>
  observation: string
  vitalDraft: VitalFieldDraft
  onClose: () => void
  onConfirm: () => void
}

function displayValue(value?: string) {
  return value?.trim() ? value.trim() : '—'
}

function ConfirmTriageModal({
  open,
  loading,
  risk,
  symptoms,
  symptomLabelByKey,
  observation,
  vitalDraft,
  onClose,
  onConfirm
}: IConfirmTriageModalProps) {
  const selectedSymptoms = symptoms.map((key) => symptomLabelByKey[key] ?? key)

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnHidden
      maskClosable={!loading}
      closable={!loading}
    >
      <h2 className={styles.title}>Confirmar conclusão da triagem</h2>
      <p className={styles.subtitle}>
        Revise os dados preenchidos antes de encaminhar o paciente para a fila
        médica.
      </p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Resumo da triagem</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Classificação de risco</span>
            <div className={styles.value}>
              {risk ? (
                <RiskTag risk={risk} useTooltip={false} />
              ) : (
                <span className={styles.muted}>Não selecionado</span>
              )}
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Temperatura</span>
            <span className={styles.value}>
              {masks(vitalDraft.temperature, 'temperature') + ' °C'}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Pressão arterial</span>
            <span className={styles.value}>
              {masks(vitalDraft.bloodPressure, 'bloodPressure')}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Frequência cardíaca</span>
            <span className={styles.value}>
              {displayValue(vitalDraft.heartRate) + ' bpm'}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Saturação O2</span>
            <span className={styles.value}>
              {displayValue(vitalDraft.oxygenSaturation) + '%'}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Escala de dor</span>
            <span className={styles.value}>
              {displayValue(vitalDraft.painLevel) + ' / 10'}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Sintomas selecionados</h3>
        {selectedSymptoms.length ? (
          <div className={styles.tags}>
            {selectedSymptoms.map((symptom) => (
              <SymptomTag key={symptom} symptom={symptom} selected />
            ))}
          </div>
        ) : (
          <span className={styles.muted}>Nenhum sintoma selecionado.</span>
        )}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Observação geral</h3>
        <p className={styles.observation}>{displayValue(observation)}</p>
      </section>

      <Flex justify='flex-end' gap={8} className={styles.footer}>
        <Button loading={loading} onClick={onConfirm}>
          Confirmar e concluir triagem
        </Button>
      </Flex>
    </Modal>
  )
}

export default ConfirmTriageModal
