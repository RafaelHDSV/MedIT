import { AttendanceRisk, AttendanceRiskLabels } from '@/interfaces/IAttendance'
import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
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

const nurseRiskLabels: Record<AttendanceRisk, string> = {
  [AttendanceRisk.EMERGENCY]: 'Alto',
  [AttendanceRisk.VERY_URGENT]: 'Alto',
  [AttendanceRisk.URGENT]: 'Alto',
  [AttendanceRisk.LESS_URGENT]: 'Médio',
  [AttendanceRisk.NOT_URGENT]: 'Baixo'
}

const nurseRiskColors: Record<AttendanceRisk, IRiskColors> = {
  [AttendanceRisk.EMERGENCY]: { color: '#E74C64', bgColor: '#E74C6433' },
  [AttendanceRisk.VERY_URGENT]: { color: '#E74C64', bgColor: '#E74C6433' },
  [AttendanceRisk.URGENT]: { color: '#E74C64', bgColor: '#E74C6433' },
  [AttendanceRisk.LESS_URGENT]: { color: '#B3A800', bgColor: '#F0F33266' },
  [AttendanceRisk.NOT_URGENT]: { color: '#2ECC71', bgColor: '#2ECC7133' }
}

function RiskTag({ risk, className }: IRiskTagProps) {
  const { user } = useAuth()
  if (!risk) return
  const isNurse = user?.level === UserLevels.NURSE

  // VIEIRA: Centralizar cores no variables
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
      color: '#B3A800',
      bgColor: '#F0F33266'
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

  const label = isNurse ? nurseRiskLabels[risk] : AttendanceRiskLabels[risk]
  const activeColors = isNurse ? nurseRiskColors[risk] : colors[risk]

  return (
    <Tooltip title={label} className={className ?? ''}>
      <span
        className={`${styles.tag} ellipsis ${className ?? ''}`}
        style={
          {
            '--color': activeColors.color,
            '--bgColor': activeColors.bgColor
          } as React.CSSProperties & Record<string, string>
        }
      >
        {label}
      </span>
    </Tooltip>
  )
}

export default RiskTag
