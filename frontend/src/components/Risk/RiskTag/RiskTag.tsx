import { AttendanceRisk, AttendanceRiskLabels } from '@/interfaces/IAttendance'
import { Tooltip } from 'antd'
import { riskColors } from '../riskConstants'
import styles from './RiskTag.module.scss'

interface IRiskTagProps {
  risk?: AttendanceRisk
  className?: string
  useTooltip?: boolean
}

function RiskTag({ risk, className, useTooltip = true }: IRiskTagProps) {
  if (!risk) return

  const label = AttendanceRiskLabels[risk]

  return (
    <Tooltip title={useTooltip ? label : undefined} className={className ?? ''}>
      <span
        className={`${styles.tag} ellipsis ${className ?? ''}`}
        style={
          {
            '--color': riskColors[risk].color,
            '--bgColor': riskColors[risk].bgColor
          } as React.CSSProperties & Record<string, string>
        }
      >
        {label}
      </span>
    </Tooltip>
  )
}

export default RiskTag
