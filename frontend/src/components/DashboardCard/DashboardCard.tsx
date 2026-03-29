import type { Icon } from '@phosphor-icons/react'
import styles from './DashboardCard.module.scss'

function DashboardCard({
  icon: Icon,
  title,
  asideText,
  gridArea,
  children
}: {
  icon: Icon
  title: string
  asideText: string
  gridArea?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.section} style={{ gridArea }}>
      <div className={styles.header}>
        <h3>{title}</h3>

        <div className={styles.asideInfo}>
          <Icon size={22} />
          <span>{asideText}</span>
        </div>
      </div>

      {children}
    </div>
  )
}

export default DashboardCard
