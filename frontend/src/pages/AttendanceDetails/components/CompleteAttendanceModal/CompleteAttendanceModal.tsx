import Button from '@/components/Button/Button'
import {
    PatientDisposition,
    PatientDispositionLabels,
    type IPrescribedMedication
} from '@/interfaces/IAttendance'
import type { IDiseaseOption } from '@/interfaces/ISymptomDiseases'
import { Flex, Input, Modal, Select } from 'antd'
import { useMemo, useState } from 'react'
import styles from './CompleteAttendanceModal.module.scss'

export const DEFAULT_EXAM_CATALOG = [
  'Hemograma',
  'Tomografia',
  'Urina',
  'Sangue',
  'Raio-X',
  'COVID'
] as const

export interface ICompleteAttendancePayload {
  diagnosisKey: string
  diagnosisText?: string
  patientDisposition?: PatientDisposition
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
}

interface ICompleteAttendanceModalProps {
  open: boolean
  loading: boolean
  onClose: () => void
  onSubmit: (payload: ICompleteAttendancePayload) => void
  diseaseOptions: IDiseaseOption[]
  initialDiagnosisKey?: string
  initialDiagnosisText?: string
  initialPatientDisposition?: PatientDisposition
  initialPrescribedMedications?: IPrescribedMedication[]
  initialPrescribedExams?: string[]
  recommendedExams?: string[]
}

const EMPTY_MEDICATION: IPrescribedMedication = { name: '' }

const dispositionOptions = Object.values(PatientDisposition).map((value) => ({
  value,
  label: PatientDispositionLabels[value]
}))

function CompleteAttendanceModal({
  open,
  loading,
  onClose,
  onSubmit,
  diseaseOptions,
  initialDiagnosisKey,
  initialDiagnosisText,
  initialPatientDisposition,
  initialPrescribedMedications,
  initialPrescribedExams,
  recommendedExams
}: ICompleteAttendanceModalProps) {
  const [diagnosisKey, setDiagnosisKey] = useState<string | undefined>(
    initialDiagnosisKey
  )
  const [diagnosisText, setDiagnosisText] = useState(initialDiagnosisText ?? '')
  const [disposition, setDisposition] = useState<
    PatientDisposition | undefined
  >(initialPatientDisposition)
  const [medications, setMedications] = useState<IPrescribedMedication[]>(() =>
    initialPrescribedMedications?.length
      ? initialPrescribedMedications.map((item) => ({ ...item }))
      : [{ ...EMPTY_MEDICATION }]
  )
  const [exams, setExams] = useState<string[]>(initialPrescribedExams ?? [])

  const examCatalog = useMemo(() => {
    const base = [...DEFAULT_EXAM_CATALOG] as string[]
    const merged = new Set<string>(base)
    recommendedExams?.forEach((exam) => {
      if (exam && typeof exam === 'string') merged.add(exam)
    })
    return [...merged]
  }, [recommendedExams])

  function updateMedication<K extends keyof IPrescribedMedication>(
    index: number,
    field: K,
    value: IPrescribedMedication[K]
  ) {
    setMedications((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    )
  }

  function addMedication() {
    setMedications((prev) => [...prev, { ...EMPTY_MEDICATION }])
  }

  function removeMedication(index: number) {
    setMedications((prev) => {
      const next = prev.filter((_, i) => i !== index)
      return next.length ? next : [{ ...EMPTY_MEDICATION }]
    })
  }

  function toggleExam(exam: string) {
    setExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    )
  }

  function handleSubmit() {
    if (!diagnosisKey) return
    const cleanedMedications = medications
      .map((med) => ({
        name: med.name?.trim() ?? '',
        dosage: med.dosage?.trim() || undefined,
        frequency: med.frequency?.trim() || undefined,
        duration: med.duration?.trim() || undefined,
        observation: med.observation?.trim() || undefined
      }))
      .filter((med) => med.name.length > 0)

    onSubmit({
      diagnosisKey,
      diagnosisText: diagnosisText.trim() || undefined,
      patientDisposition: disposition,
      prescribedMedications: cleanedMedications.length
        ? cleanedMedications
        : undefined,
      prescribedExams: exams.length ? exams : undefined
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnHidden
      mask={{ closable: !loading }}
      closable={!loading}
    >
      <h2 className={styles.title}>Finalização do atendimento</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Resultado do diagnóstico</h3>

        <div className={styles.diagnosisGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Diagnóstico</label>
            <Select
              showSearch={{ filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()) }}
              allowClear
              size='large'
              placeholder='Selecione o diagnóstico'
              options={diseaseOptions.map((disease) => ({
                value: disease.key,
                label: disease.label
              }))}
              value={diagnosisKey}
              onChange={(value) => setDiagnosisKey(value)}
              
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Paciente deve</label>
            <Select
              allowClear
              size='large'
              placeholder='Selecione'
              options={dispositionOptions}
              value={disposition}
              onChange={(value) => setDisposition(value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Observação diagnóstica (opcional)
          </label>
          <Input.TextArea
            rows={2}
            placeholder='Notas clínicas complementares'
            value={diagnosisText}
            onChange={(event) => setDiagnosisText(event.target.value)}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Medicamentos</h3>

        <div className={styles.medicationList}>
          {medications.map((medication, index) => (
            <div className={styles.medicationCard} key={index}>
              <div className={styles.medicationGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Medicamento</label>
                  <Input
                    placeholder='Ex.: Dipirona 500mg'
                    value={medication.name}
                    onChange={(event) =>
                      updateMedication(index, 'name', event.target.value)
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Dosagem</label>
                  <Input
                    placeholder='Ex.: 1 comprimido'
                    value={medication.dosage ?? ''}
                    onChange={(event) =>
                      updateMedication(index, 'dosage', event.target.value)
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Frequência</label>
                  <Input
                    placeholder='Ex.: 8/8h'
                    value={medication.frequency ?? ''}
                    onChange={(event) =>
                      updateMedication(index, 'frequency', event.target.value)
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Duração</label>
                  <Input
                    placeholder='Ex.: 5 dias'
                    value={medication.duration ?? ''}
                    onChange={(event) =>
                      updateMedication(index, 'duration', event.target.value)
                    }
                  />
                </div>
                <div className={`${styles.field} ${styles.fullRow}`}>
                  <label className={styles.label}>Observações</label>
                  <Input
                    placeholder='Ex.: Tomar após refeição'
                    value={medication.observation ?? ''}
                    onChange={(event) =>
                      updateMedication(index, 'observation', event.target.value)
                    }
                  />
                </div>
              </div>

              {medications.length > 1 ? (
                <button
                  type='button'
                  className={styles.removeMedication}
                  onClick={() => removeMedication(index)}
                >
                  Remover medicamento
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <button
          type='button'
          className={styles.addMedication}
          onClick={addMedication}
        >
          + Adicionar medicamento
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Exames</h3>

        <div className={styles.examTags}>
          {examCatalog.map((exam) => {
            const selected = exams.includes(exam)
            return (
              <button
                type='button'
                key={exam}
                className={`${styles.examTag} ${
                  selected ? styles.examTagSelected : ''
                }`}
                onClick={() => toggleExam(exam)}
              >
                {exam}
              </button>
            )
          })}
        </div>
      </section>

      <Flex justify='flex-end' gap={8} className={styles.footer}>
        <Button mode='outline' onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          loading={loading}
          disabled={!diagnosisKey}
          onClick={handleSubmit}
        >
          Finalizar
        </Button>
      </Flex>
    </Modal>
  )
}

export default CompleteAttendanceModal
