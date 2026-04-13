import styles from './ConditionsCard.module.scss'

function ConditionsCard({
  name,
  compatibility
}: {
  name: string
  compatibility: number
}) {
  return (
    <div className={styles.item}>
      <p className={styles.name}>{name}</p>

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
