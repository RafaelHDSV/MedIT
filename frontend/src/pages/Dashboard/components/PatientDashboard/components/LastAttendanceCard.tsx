import type { IAttendance } from '@/interfaces/IAttendance'
import { formatDate } from '@/utils/formatDate'
import { getDiseaseDisplayLabel } from '@/utils/getDiseaseDisplayLabel'
import {
  BuildingsIcon,
  CalendarBlankIcon,
  UserIcon
} from '@phosphor-icons/react'
import { Skeleton } from 'antd'
import styles from '../PatientDashboard.module.scss'

interface ILastAttendanceCardProps {
  attendance: Partial<IAttendance>
  loading: boolean
}

function LastAttendanceCard({ attendance, loading }: ILastAttendanceCardProps) {
  if (loading) {
    return (
      <div className={styles.lastAttendanceCard}>
        <h3>Último atendimento</h3>
        <div className={styles.lastAttendanceInfo}>
          <Skeleton active title={false} paragraph={{ rows: 3 }} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.lastAttendanceCard}>
      <h3>Último atendimento</h3>

      <div className={styles.lastAttendanceInfo}>
        {attendance.date && (
          <div className={styles.infoRow}>
            <CalendarBlankIcon size={16} />
            <span>
              <strong>Data:</strong>
              {formatDate({ date: attendance.date as Date, mode: 'date' })}
            </span>
          </div>
        )}
        {attendance.doctorName && (
          <div className={styles.infoRow}>
            <UserIcon size={16} />
            <span>
              <strong>Médico:</strong> {attendance.doctorName}
            </span>
          </div>
        )}
        {attendance.unitName && (
          <div className={styles.infoRow}>
            <BuildingsIcon size={16} />
            <span>
              <strong>Unidade:</strong> {attendance.unitName}
            </span>
          </div>
        )}
      </div>

      {attendance.diagnosisKey && (
        <p className={styles.diagnosisRow}>
          Diagnóstico:
          <span className={styles.diagnosisCode}>
            {getDiseaseDisplayLabel(attendance.diagnosisKey)}
          </span>
        </p>
      )}

      {attendance.prescribedMedications &&
        attendance.prescribedMedications.length > 0 && (
          <p className={styles.lastMedication}>
            <span>Medicação:</span>
            {attendance.prescribedMedications.map((m) => m.name).join(', ')}
          </p>
        )}

      {attendance.generalObservation && (
        <p className={styles.lastObservation}>
          <span>Orientação:</span> {attendance.generalObservation}
        </p>
      )}
    </div>
  )
}

export default LastAttendanceCard
