import Button from '@/components/Button/Button'
import { AttendanceStatus, type IAttendance } from '@/interfaces/IAttendance'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import { ROUTES } from '@/routes/constants'
import { formatDate } from '@/utils/formatDate'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import styles from '../PatientDashboard.module.scss'

interface ICurrentConsultCardProps {
  attendance: Partial<IAttendance>
  symptomOptions: ISymptomOption[]
  onConfirmArrival?: () => void
  arrivalLoading?: boolean
}

function translateSymptoms(
  symptoms: string[] | undefined,
  options: ISymptomOption[]
): string[] {
  if (!symptoms?.length) return []
  if (!options.length) return symptoms

  return symptoms.map((s) => {
    const byKey = options.find((o) => o.key === s)
    if (byKey) return byKey.label
    const byLabel = options.find((o) => o.label === s)
    if (byLabel) return byLabel.label
    return s
  })
}

function CurrentConsultCard({
  attendance,
  symptomOptions,
  onConfirmArrival,
  arrivalLoading
}: ICurrentConsultCardProps) {
  const navigate = useNavigate()
  const translatedSymptoms = translateSymptoms(
    attendance.symptoms,
    symptomOptions
  )
  const isOnTheWay = attendance.status === AttendanceStatus.ON_THE_WAY

  return (
    <div className={styles.currentConsultCard}>
      <div className={styles.currentConsultHeader}>
        <h3>Consulta atual</h3>
        <button
          className={styles.editBtn}
          onClick={() => {
            if (!attendance._id) return
            
            navigate(
              `${ROUTES.PRE_REGISTRATION.path}?mode=edit&attendanceId=${String(attendance._id)}`
            )
          }}
          title='Editar pré-atendimento'
          aria-label='Editar pré-atendimento'
        >
          <PencilSimpleIcon size={16} weight='bold' />
        </button>
      </div>

      <div className={styles.currentConsultRow}>
        <span className={styles.rowLabel}>Nível de dor</span>
        <span className={styles.rowValue}>{attendance.painLevel ?? '-'}</span>
      </div>

      <div className={styles.currentConsultRow}>
        <span className={styles.rowLabel}>Queixa principal</span>
        <span className={styles.rowValue}>{attendance.complaint ?? '-'}</span>
      </div>

      <div className={styles.currentConsultRow}>
        <span className={styles.rowLabel}>Se automedicou?</span>
        <span className={styles.rowValue}>
          {attendance.selfMedicated === true
            ? 'Sim'
            : attendance.selfMedicated === false
              ? 'Não'
              : '-'}
        </span>
      </div>

      <div className={styles.currentConsultRow}>
        <span className={styles.rowLabel}>Quando os sintomas começaram?</span>
        <span className={styles.rowValue}>
          {formatDate({
            date: attendance.symptomStartDate as Date,
            mode: 'date'
          })}
        </span>
      </div>

      <div className={styles.currentConsultRow}>
        <span className={styles.rowLabel}>Chegada</span>
        <span className={styles.rowValue}>
          {formatDate({
            date: attendance.date as Date,
            mode: 'datetimeWithAt'
          })}
        </span>
      </div>

      {translatedSymptoms.length > 0 && (
        <div className={styles.currentConsultRow}>
          <span className={styles.rowLabel}>Sintomas</span>
          <span className={styles.rowValue}>
            {translatedSymptoms.join(', ')}
          </span>
        </div>
      )}

      {isOnTheWay && onConfirmArrival && (
        <div className={styles.confirmArrivalRow}>
          <Button
            className='w-100'
            type='primary'
            loading={arrivalLoading}
            onClick={onConfirmArrival}
          >
            Confirmar chegada ao hospital
          </Button>
        </div>
      )}
    </div>
  )
}

export default CurrentConsultCard
