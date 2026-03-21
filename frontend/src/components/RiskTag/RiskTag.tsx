import { TriagesRisk, TriagesRiskLabels } from '@/interfaces/ITriages'
import styles from './RiskTag.module.scss'

interface IRiskTagProps {
  risk: TriagesRisk
}

interface IRiskColors {
  color: string
  bgColor: string
}

function RiskTag({ risk }: IRiskTagProps) {
  const colors: Record<TriagesRisk, IRiskColors> = {
    [TriagesRisk.EMERGENCY]: {
      color: '#E74C64',
      bgColor: '#E74C6433'
    },
    [TriagesRisk.VERY_URGENT]: {
      color: '#E78F4C',
      bgColor: '#E78F4C33'
    },
    [TriagesRisk.URGENT]: {
      color: '#F0F326',
      bgColor: '#F0F32633'
    },
    [TriagesRisk.LESS_URGENT]: {
      color: '#2ECC71',
      bgColor: '#2ECC7133'
    },
    [TriagesRisk.NOT_URGENT]: {
      color: '#2E8FCC',
      bgColor: '#2E8FCC33'
    }
  }

  return (
    <span
      className={styles.tag}
      style={
        {
          '--color': colors[risk].color,
          '--bgColor': colors[risk].bgColor
        } as React.CSSProperties & Record<string, string>
      }
    >
      {TriagesRiskLabels[risk]}
    </span>
  )
}

export default RiskTag
