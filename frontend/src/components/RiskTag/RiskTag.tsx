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
      color: '#E74C64',
      bgColor: '#E74C6433'
    },
    [AttendanceRisk.VERY_URGENT]: {
      color: '#E78F4C',
      bgColor: '#E78F4C33'
    },
    [AttendanceRisk.URGENT]: {
      color: '#F0F326',
      bgColor: '#F0F32633'
    },
    [AttendanceRisk.LESS_URGENT]: {
      color: '#2ECC71',
      bgColor: '#2ECC7133'
    },
    [AttendanceRisk.NOT_URGENT]: {
      color: '#2E8FCC',
      bgColor: '#2E8FCC33'
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
