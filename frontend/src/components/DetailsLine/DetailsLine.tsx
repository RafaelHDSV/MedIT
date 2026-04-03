import { Tooltip } from 'antd'
import styles from './DetailsLine.module.scss'

interface IDetailsLineProps {
  label: string
  value: string | number | undefined
}

function DetailsLine({ label, value }: IDetailsLineProps) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <Tooltip title={String(value)}>
        <span className={styles.value}>{value}</span>
      </Tooltip>
    </div>
  )
}

export default DetailsLine
