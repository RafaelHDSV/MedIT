import { AttendanceRisk, AttendanceRiskLabels } from '@/interfaces/IAttendance'
import { riskColors } from '../riskConstants'
import styles from './RiskSelector.module.scss'

interface IRiskSelector {
  selected: AttendanceRisk | undefined
  onChange: (risk: AttendanceRisk) => void
  disabled?: boolean
}

function RiskSelector({ selected, onChange, disabled }: IRiskSelector) {
  return (
    <div className={styles.container}>
      {Object.values(AttendanceRisk).map((risk: AttendanceRisk) => {
        const isActive = selected === risk
        const { color, bgColor } = riskColors[risk]

        const label = AttendanceRiskLabels[risk]

        return (
          <button
            key={risk}
            type='button'
            disabled={disabled}
            onClick={() => onChange(risk)}
            className={`${styles.option} ${isActive ? styles.active : ''}`}
            style={
              {
                '--color': color,
                '--bgColor': bgColor
              } as React.CSSProperties & Record<string, string>
            }
          >
            <span className='elliipsis'>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RiskSelector
