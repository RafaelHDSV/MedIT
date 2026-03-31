import type { Icon } from '@phosphor-icons/react'
import styles from './DashboardStatusCard.module.scss'

interface IDashboardStatusCardProps {
  Icon: Icon
  value: string | number | undefined
  label: string
  loading?: boolean
}

function DashboardStatusCard({
  Icon,
  value,
  label,
  loading = false
}: IDashboardStatusCardProps) {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.loading}`} />

        <div className={styles.texts}>
          <span className={`${styles.value} ${styles.loading}`} />
          <span className={`${styles.label} ${styles.loading}`} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <Icon className={styles.icon} size={24} />

      <div className={styles.texts}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  )
}

export default DashboardStatusCard
