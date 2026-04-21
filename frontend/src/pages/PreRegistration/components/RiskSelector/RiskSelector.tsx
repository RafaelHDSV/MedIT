import { AttendanceRisk, AttendanceRiskLabels } from '@/interfaces/IAttendance'
import styles from './RiskSelector.module.scss'

const RISK_OPTIONS: AttendanceRisk[] = [
  AttendanceRisk.NOT_URGENT,
  AttendanceRisk.LESS_URGENT,
  AttendanceRisk.URGENT,
  AttendanceRisk.VERY_URGENT,
  AttendanceRisk.EMERGENCY
]

const riskColors: Record<AttendanceRisk, { color: string; bgColor: string }> = {
  [AttendanceRisk.NOT_URGENT]: {
    color: 'var(--attendance-risk-not-urgent-color)',
    bgColor: 'var(--attendance-risk-not-urgent-bg)'
  },
  [AttendanceRisk.LESS_URGENT]: {
    color: 'var(--attendance-risk-less-urgent-color)',
    bgColor: 'var(--attendance-risk-less-urgent-bg)'
  },
  [AttendanceRisk.URGENT]: {
    color: 'var(--attendance-risk-urgent-color)',
    bgColor: 'var(--attendance-risk-urgent-bg)'
  },
  [AttendanceRisk.VERY_URGENT]: {
    color: 'var(--attendance-risk-very-urgent-color)',
    bgColor: 'var(--attendance-risk-very-urgent-bg)'
  },
  [AttendanceRisk.EMERGENCY]: {
    color: 'var(--attendance-risk-emergency-color)',
    bgColor: 'var(--attendance-risk-emergency-bg)'
  }
}

interface IRiskSelector {
  selected: AttendanceRisk | undefined
  onChange: (risk: AttendanceRisk) => void
  disabled?: boolean
}

function RiskSelector({ selected, onChange, disabled }: IRiskSelector) {
  return (
    <div className={styles.container}>
      {RISK_OPTIONS.map((risk) => {
        const isActive = selected === risk
        const { color, bgColor } = riskColors[risk]

        return (
          <button
            key={risk}
            type='button'
            disabled={disabled}
            onClick={() => onChange(risk)}
            className={styles.option}
            style={
              isActive
                ? {
                    color,
                    backgroundColor: bgColor,
                    borderColor: color
                  }
                : undefined
            }
          >
            {AttendanceRiskLabels[risk]}
          </button>
        )
      })}
    </div>
  )
}

export default RiskSelector
