import { getDiseaseDisplayLabel } from '@/utils/getDiseaseDisplayLabel'
import styles from './ConditionsCard.module.scss'

function ConditionsCard({
  className,
  name,
  compatibility,
  onOpenDetail
}: {
  className?: string
  name: string
  compatibility: number
  onOpenDetail?: () => void
}) {
  const label = getDiseaseDisplayLabel(name)

  return (
    <div
      className={`${styles.item} ${onOpenDetail ? styles.clickable : ''} ${className ?? ''}`}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (!onOpenDetail) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail()
        }
      }}
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <p className={styles.name}>{label}</p>

      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${compatibility}%` }} />
      </div>

      <span className={styles.barPercentage}>
        {compatibility}% compatibilidade
      </span>
    </div>
  )
}

export default ConditionsCard
