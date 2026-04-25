import type { Icon } from '@phosphor-icons/react'
import styles from './DashboardStatusCard.module.scss'

interface IDashboardStatusCardProps {
  Icon: Icon
  value: string | number | undefined
  subValue: string | number | undefined
  label: string
  loading?: boolean
}

function DashboardStatusCard({
  Icon,
  value,
  subValue,
  label,
  loading = false
}: IDashboardStatusCardProps) {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.loading}`} />

        <div className={styles.texts}>
          <span className={`${styles.value} ${styles.loading}`} />
          <span className={`${styles.subValue} ${styles.loading}`} />
          <span className={`${styles.label} ${styles.loading}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <Icon className={styles.icon} size={24} />

      <div className={styles.texts}>
        <div className={styles.value}>
          <span>{value ?? '-'}</span>
          {subValue && <span className={styles.subValue}>{subValue}</span>}
        </div>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  )
}

export default DashboardStatusCard
