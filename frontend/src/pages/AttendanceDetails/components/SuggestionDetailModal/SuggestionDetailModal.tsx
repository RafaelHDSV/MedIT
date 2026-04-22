import type { ISuggestionDetails } from '@/interfaces/ISymptomDiseases'
import { getDiseaseDisplayLabel } from '@/utils/getDiseaseDisplayLabel'
import { Modal, Spin } from 'antd'
import ConditionsCard from '../ConditionsCard/ConditionsCard'
import styles from './SuggestionDetailModal.module.scss'

function keysToSortedLabels(
  keys: string[],
  labelByKey: Record<string, string>
): string[] {
  const labels = keys.map((k) => labelByKey[k] ?? k)
  return [...new Set(labels)].sort((a, b) =>
    a.localeCompare(b, 'pt', { sensitivity: 'base' })
  )
}

interface ISuggestionDetailModalProps {
  open: boolean
  onClose: () => void
  loading: boolean
  detail: ISuggestionDetails | null
  medications: string[]
  exams: string[]
  symptomLabelByKey: Record<string, string>
}

function SuggestionDetailModal({
  open,
  onClose,
  loading,
  detail,
  medications,
  exams,
  symptomLabelByKey
}: ISuggestionDetailModalProps) {
  const diseaseLabel = detail?.disease
    ? getDiseaseDisplayLabel(detail.disease)
    : ''
  const reportedLabels = detail?.reportedSymptomKeys
    ? keysToSortedLabels(detail.reportedSymptomKeys, symptomLabelByKey)
    : []
  const referenceLabels = detail?.referenceSymptomKeys
    ? keysToSortedLabels(detail.referenceSymptomKeys, symptomLabelByKey)
    : []

  const ratioTop = detail?.matchedReferenceCount ?? 0
  const ratioBottom = detail?.referenceSymptomCount ?? 0

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnHidden
    >
      <h2 className={styles.title}>
        Detalhes da Sugestão {diseaseLabel ?? 'IA'}
      </h2>

      {loading || !detail ? (
        <div className={styles.loading}>
          <Spin />
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <ConditionsCard
              className='h-100'
              name={diseaseLabel}
              compatibility={detail?.compatibility ?? 0}
            />

            <div className={styles.card}>
              <div className={styles.ratio}>
                {ratioBottom > 0 ? `${ratioTop}/${ratioBottom}` : '—'}
              </div>
              <div className={styles.ratioSub}>Relatados vs referência</div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Sintomas relatados</h4>
              <div className={styles.tags}>
                {reportedLabels.length ? (
                  reportedLabels.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))
                ) : (
                  <p className={styles.emptyNote}>Nenhum sintoma mapeado.</p>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Sintomas de referência</h4>
              <div className={styles.tags}>
                {referenceLabels.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Medicamentos recomendados</h4>
              <div className={styles.tags}>
                {medications.length ? (
                  medications.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))
                ) : (
                  <p className={styles.emptyNote}>
                    Nenhum medicamento cadastrado para esta condição na base
                    sintoma–doença.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Exames recomendados</h4>
              <div className={styles.tags}>
                {exams.length ? (
                  exams.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))
                ) : (
                  <p className={styles.emptyNote}>
                    Nenhum exame cadastrado para esta condição na base
                    sintoma–doença.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}

export default SuggestionDetailModal
