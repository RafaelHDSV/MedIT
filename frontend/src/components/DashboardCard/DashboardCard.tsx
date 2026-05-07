import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import styles from './DashboardCard.module.scss'

interface IDashboardCardProps {
  icon: Icon
  title: string
  asideText: string
  gridArea?: string
  headerExtra?: ReactNode
  children: ReactNode
}

function DashboardCard({
  icon: Icon,
  title,
  asideText,
  gridArea,
  headerExtra,
  children
}: IDashboardCardProps) {
  return (
    <div className={styles.section} style={{ gridArea }}>
      <div className={styles.header}>
        <h3>{title}</h3>

        <div className={styles.headerMeta}>
          <div className={styles.asideInfo}>
            <Icon size={22} />
            <span>{asideText}</span>
          </div>
          {headerExtra ? (
            <div className={styles.headerExtra}>{headerExtra}</div>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  )
}

export default DashboardCard
