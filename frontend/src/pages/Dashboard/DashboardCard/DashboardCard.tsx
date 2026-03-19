import type { Icon } from '@phosphor-icons/react'
import styles from './DashboardCard.module.scss'

interface IDashboardCardProps {
  Icon: Icon
  value: string
  label: string
}

function DashboardCard({ Icon, value, label }: IDashboardCardProps) {
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

export default DashboardCard
