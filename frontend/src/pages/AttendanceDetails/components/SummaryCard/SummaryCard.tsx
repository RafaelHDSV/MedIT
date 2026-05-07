import DetailsLine from '@/components/DetailsLine/DetailsLine'
import {
  PatientDispositionLabels,
  type IPrescribedMedication
} from '@/interfaces/IAttendance'
import { formatDate } from '@/utils/formatDate'
import styles from './SummaryCard.module.scss'

interface SummaryCardProps {
  diagnosis?: string
  diagnosisText?: string
  patientDisposition?: keyof typeof PatientDispositionLabels
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
  completedAt?: string | Date
}

function SummaryCard({
  diagnosis,
  diagnosisText,
  patientDisposition,
  prescribedMedications,
  prescribedExams,
  completedAt
}: SummaryCardProps) {
  const diagnosisValue = diagnosis ?? 'Não informado'
  const diagnosisTextValue = diagnosisText ?? 'Não informado'
  const dispositionValue = patientDisposition
    ? PatientDispositionLabels[patientDisposition]
    : 'Não informado'
  const completedAtValue = completedAt
    ? formatDate({ date: completedAt, mode: 'datetime' })
    : 'Não informado'

  const medicationsValue =
    prescribedMedications && prescribedMedications.length > 0
      ? prescribedMedications
          .map((medication) => {
            return medication.name?.trim()
          })
          .filter(Boolean)
      : ['Nenhum medicamento prescrito']

  const examsValue =
    prescribedExams && prescribedExams.length > 0
      ? prescribedExams
      : ['Nenhum exame prescrito']

  return (
    <section>
      <h3 className={styles.title}>Resumo do atendimento</h3>

      <div className={styles.grid}>
        <DetailsLine label='Diagnóstico' value={diagnosisValue} />
        <DetailsLine label='Paciente deve' value={dispositionValue} />
        <DetailsLine label='Concluído em' value={completedAtValue} />
        <DetailsLine
          label='Observação diagnóstica'
          value={diagnosisTextValue}
        />
        <DetailsLine
          label='Medicamentos prescritos'
          value={medicationsValue.join(', ')}
        />
        <DetailsLine label='Exames prescritos' value={examsValue.join(', ')} />
      </div>
    </section>
  )
}

export default SummaryCard
