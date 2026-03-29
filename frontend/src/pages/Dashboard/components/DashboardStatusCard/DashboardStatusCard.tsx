import type { Icon } from '@phosphor-icons/react'
import styles from './DashboardStatusCard.module.scss'

interface IDashboardStatusCardProps {
  Icon: Icon
  value: string
  label: string
}

function DashboardStatusCard({
  Icon,
  value,
  label
}: IDashboardStatusCardProps) {
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
