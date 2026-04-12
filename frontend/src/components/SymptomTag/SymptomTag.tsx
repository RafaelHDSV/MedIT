import { Tag } from 'antd'
import styles from './SymptomTag.module.scss'

interface ISymptomTagProps {
  symptom: string
  selected?: boolean
  clickable?: boolean
  onClick?: () => void
}

function SymptomTag({ symptom, selected = false, clickable = false, onClick }: ISymptomTagProps) {
  return (
    <Tag
      onClick={clickable ? onClick : undefined}
      className={`${styles.symptomTag} ${selected ? styles.selected : ''} ${clickable ? styles.clickable : ''}`}
    >
      {symptom}
    </Tag>
  )
}

export default SymptomTag