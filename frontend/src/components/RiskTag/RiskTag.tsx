import { AttendanceRisk, AttendanceRiskLabels } from '@/interfaces/IAttendance'
import { Tooltip } from 'antd'
import styles from './RiskTag.module.scss'

interface IRiskTagProps {
  risk?: AttendanceRisk
  className?: string
}

interface IRiskColors {
  color: string
  bgColor: string
}

function RiskTag({ risk, className }: IRiskTagProps) {
  if (!risk) return

  const colors: Record<AttendanceRisk, IRiskColors> = {
    [AttendanceRisk.EMERGENCY]: {
      color: 'var(--attendance-risk-emergency-color)',
      bgColor: 'var(--attendance-risk-emergency-bg)'
    },
    [AttendanceRisk.VERY_URGENT]: {
      color: 'var(--attendance-risk-very-urgent-color)',
      bgColor: 'var(--attendance-risk-very-urgent-bg)'
    },
    [AttendanceRisk.URGENT]: {
      color: 'var(--attendance-risk-urgent-color)',
      bgColor: 'var(--attendance-risk-urgent-bg)'
    },
    [AttendanceRisk.LESS_URGENT]: {
      color: 'var(--attendance-risk-less-urgent-color)',
      bgColor: 'var(--attendance-risk-less-urgent-bg)'
    },
    [AttendanceRisk.NOT_URGENT]: {
      color: 'var(--attendance-risk-not-urgent-color)',
      bgColor: 'var(--attendance-risk-not-urgent-bg)'
    }
  }

  const label = AttendanceRiskLabels[risk]

  return (
    <Tooltip title={label} className={className ?? ''}>
      <span
        className={`${styles.tag} ellipsis ${className ?? ''}`}
        style={
          {
            '--color': colors[risk].color,
            '--bgColor': colors[risk].bgColor
          } as React.CSSProperties & Record<string, string>
        }
      >
        {label}
      </span>
    </Tooltip>
  )
}

export default RiskTag
