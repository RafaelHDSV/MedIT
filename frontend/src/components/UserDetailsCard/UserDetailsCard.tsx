import type { Icon } from '@phosphor-icons/react'
import { Skeleton } from 'antd'
import styles from './UserDetailsCard.module.scss'

interface IDetailsItemProps {
  label: string
  value?: string
}

function DetailsItem({ label, value }: IDetailsItemProps) {
  return (
    <div className={styles.detailsItem}>
      <span className={styles.label}>{label}</span>
      {value && <span className={styles.value}>{value}</span>}
    </div>
  )
}

interface IUserDetailsCardProps {
  Icon: Icon
  title: string
  className?: string
  itens: IDetailsItemProps[]
  loading?: boolean
  useFullWidth?: boolean
}

function UserDetailsCard({
  Icon,
  title,
  className,
  itens,
  loading = false,
  useFullWidth = false
}: IUserDetailsCardProps) {
  if (loading) {
    return (
      <section className={`${styles.card} ${className ?? ''}`}>
        <Skeleton active title={false} paragraph={{ rows: 1 }} />

        {itens.map((item) => (
          <Skeleton.Button
            key={`${item.label}_${item.value}`}
            className={styles.itemSkeleton}
            active
          />
        ))}
      </section>
    )
  }

  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.cardHeader}>
        <Icon size={22} />
        {title}
      </div>

      <div
        className={`${useFullWidth ? styles.twoColumns : styles.itemsContainer}`}
      >
        {itens.map((item) => (
          <DetailsItem
            key={`${item.label}_${item.value}`}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  )
}

export default UserDetailsCard
